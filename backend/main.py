import json
import re
import uuid
from urllib.parse import urlparse, parse_qs
import os
import requests

import yt_dlp
from dotenv import load_dotenv
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()
client = OpenAI()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

jobs = {}  # 인메모리 저장소


class AnalyzeRequest(BaseModel):
    videoUrl: str
    targetLanguage: str = "en"
    highlightCount: int = 3


# ---------- 헬퍼 함수들 ----------

def extract_video_id(url: str) -> str:
    parsed = urlparse(url)
    if parsed.hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
        qs = parse_qs(parsed.query)
        if "v" in qs:
            return qs["v"][0]
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/")
    raise ValueError("올바른 유튜브 URL이 아닙니다.")


def parse_iso8601_duration(duration: str) -> int:
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def get_video_info(url: str) -> dict:
    video_id = extract_video_id(url)
    resp = requests.get(
        "https://www.googleapis.com/youtube/v3/videos",
        params={
            "part": "snippet,contentDetails",
            "id": video_id,
            "key": os.getenv("YOUTUBE_API_KEY"),
        },
    )
    data = resp.json()
    items = data.get("items", [])
    if not items:
        raise ValueError("영상을 찾을 수 없습니다.")

    snippet = items[0]["snippet"]
    thumbnails = snippet["thumbnails"]
    thumbnail_url = (
        thumbnails.get("maxres") or thumbnails.get("high")
        or thumbnails.get("standard") or thumbnails.get("medium")
        or thumbnails.get("default")
    )["url"]

    duration = parse_iso8601_duration(items[0]["contentDetails"]["duration"])

    return {
        "videoId": video_id,
        "url": url,
        "title": snippet["title"],
        "thumbnail": thumbnail_url,
        "duration": duration,
        "sourceLanguage": "ko",
    }


CAPTIONS_CACHE_DIR = "captions_cache"

def get_captions(video_id: str) -> list:
    cache_path = os.path.join(CAPTIONS_CACHE_DIR, f"{video_id}.json")

    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            raw = json.load(f)
    else:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id, languages=["ko"])
        raw = transcript.to_raw_data()
        os.makedirs(CAPTIONS_CACHE_DIR, exist_ok=True)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(raw, f, ensure_ascii=False)

    for c in raw:
        c["end"] = c["start"] + c["duration"]
    return raw


def find_candidates(captions, top_n=3, window_size=45, step=5, gap_threshold=3):
    video_end = max(c["end"] for c in captions)
    candidates = []
    w_start = 0
    while w_start + window_size <= video_end:
        w_end = w_start + window_size
        caps_in = [c for c in captions if w_start <= c["start"] < w_end]
        if len(caps_in) >= 2:
            total_chars = sum(len(c["text"]) for c in caps_in)
            density = total_chars / window_size
            gap_count = sum(
                1 for i in range(1, len(caps_in))
                if caps_in[i]["start"] - caps_in[i - 1]["end"] > gap_threshold
            )
            candidates.append({
                "start": w_start, "end": w_end,
                "raw_score": density - gap_count * 2,
                "caps": caps_in,
            })
        w_start += step

    if not candidates:
        return []

    max_raw = max(c["raw_score"] for c in candidates) or 1
    for c in candidates:
        c["density_score"] = round(max(0, c["raw_score"]) / max_raw * 100)
    candidates.sort(key=lambda c: c["density_score"], reverse=True)

    selected = []
    for c in candidates:
        overlap = any(not (c["end"] <= s["start"] or c["start"] >= s["end"]) for s in selected)
        if not overlap:
            selected.append(c)
        if len(selected) == top_n:
            break
    return selected


def length_fit_score(duration):
    if 15 <= duration <= 60:
        return 5
    diff = (15 - duration) if duration < 15 else (duration - 60)
    if diff <= 15:
        return 4
    elif diff <= 30:
        return 3
    elif diff <= 45:
        return 2
    return 1


def fix_transcript_overlaps(transcript):
    transcript.sort(key=lambda x: x["start"])
    for i in range(1, len(transcript)):
        if transcript[i]["start"] < transcript[i - 1]["end"]:
            transcript[i]["start"] = transcript[i - 1]["end"]
        if transcript[i]["end"] <= transcript[i]["start"]:
            transcript[i]["end"] = transcript[i]["start"] + 1
    return transcript

def is_mostly_korean(text: str) -> bool:
    korean_chars = len(re.findall(r"[가-힣]", text))
    total_chars = len(re.findall(r"[A-Za-z가-힣]", text))
    if total_chars == 0:
        return True
    return korean_chars / total_chars >= 0.5


def score_and_generate(caps_in, index):
    transcript_text = "\n".join(f"[{c['start']}s] {c['text']}" for c in caps_in)
    prompt = f"""다음은 한 영상의 자막입니다.

{transcript_text}

이 구간을 유튜브 숏폼(Shorts) 후보로 평가해줘. 아래 JSON 형식으로만 답해.

{{
  "scoreBreakdown": {{
    "hook": (1~5, 구간 시작 3~5초 안에 궁금증/반전을 유발하는가),
    "completeness": (1~5, 앞뒤 문맥 없이 이 구간만 봐도 이해되는가),
    "specificity": (1~5, 막연한 설명이 아니라 수치·비율 등 구체적인 정보인가),
    "emotion": (1~5, '몰랐던 상식' 등 감정적 반응을 유발하는가)
  }},
  "topic": "이 구간의 핵심 주제 한 줄 (반드시 한국어로만 작성, 영어 섞지 말 것)",
  "reason": "숏폼 후보로 추천하는 이유 한두 문장 (반드시 한국어로만 작성, 영어 섞지 말 것)",
  "transcript": [
    {{"start": 시작초, "end": 종료초, "ko": "한국어 문장", "en": "영어 번역"}}
  ],
  "generatedContent": {{
    "title": "영어 숏폼 제목",
    "description": "영어 설명 1~2문장",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
    "thumbnailText": "썸네일에 들어갈 짧은 영어 문구 (기본안)",
    "thumbnailTextAlt": "썸네일 문구 대안 2안 (기본안과 톤·표현이 달라야 하며 동일 문구 금지)"
  }}
}}

transcript 배열 구성 규칙:
- 위 자막 줄들을 자연스러운 문장 단위로 합치거나 나눠서, start/end가 서로 겹치지 않게 순서대로 구성
- 한 줄이 30초 이상 이어지지 않게, 실제 발화 호흡 단위로 5~10초 간격 여러 줄로 나눠줘
- 이 구간 길이를 고려했을 때 보통 4줄 이상 나와야 하고, 2~3줄만 나오면 너무 성긴 것

중요: topic과 reason은 100% 한국어로만 작성해야 해. targetLanguage 값과 무관하게 항상 한국어 고정이야."""

    response = client.chat.completions.create(
        model="gpt-5.4-mini",
        messages=[
            {"role": "developer", "content": "너는 유튜브 롱폼 영상에서 숏폼 후보 구간을 평가하고 콘텐츠를 생성하는 어시스턴트야. 반드시 JSON만 출력해. topic과 reason 필드는 예외 없이 항상 100% 한국어로만 작성해야 하고 영어 단어를 단 하나도 섞으면 안 돼. generatedContent 안쪽 필드들(title/description/hashtags/thumbnailText 등)만 영어로 작성해."},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
    )
    result = json.loads(response.choices[0].message.content)
    if not is_mostly_korean(result["topic"]) or not is_mostly_korean(result["reason"]):
        fix_response = client.chat.completions.create(
            model="gpt-5.4-mini",
            messages=[
                {"role": "developer", "content": "다음 JSON의 topic과 reason 값을 자연스러운 한국어로 번역해서, 같은 키 구조의 JSON으로만 반환해."},
                {"role": "user", "content": json.dumps({"topic": result["topic"], "reason": result["reason"]}, ensure_ascii=False)},
            ],
            response_format={"type": "json_object"},
        )
        fixed = json.loads(fix_response.choices[0].message.content)
        result["topic"] = fixed["topic"]
        result["reason"] = fixed["reason"]

    for line in result["transcript"]:
        line["start"] = round(line["start"])
        line["end"] = round(line["end"])

    result["transcript"] = fix_transcript_overlaps(result["transcript"])

    start_time = result["transcript"][0]["start"]
    end_time = result["transcript"][-1]["end"]
    duration = end_time - start_time

    breakdown = result["scoreBreakdown"]
    breakdown["lengthFit"] = length_fit_score(duration)
    final_score = round(
        (breakdown["hook"] * 0.3 + breakdown["completeness"] * 0.25
         + breakdown["lengthFit"] * 0.15 + breakdown["specificity"] * 0.2
         + breakdown["emotion"] * 0.1) * 20
    )

    return {
        "id": f"highlight-{index:03d}",
        "rank": index,
        "startTime": start_time,
        "endTime": end_time,
        "duration": duration,
        "score": final_score,
        "scoreBreakdown": breakdown,
        "topic": result["topic"],
        "reason": result["reason"],
        "transcript": result["transcript"],
        "generatedContent": result["generatedContent"],
    }


def run_analysis(job_id, video_url, target_language, highlight_count):
    try:
        jobs[job_id]["status"] = "processing"
        jobs[job_id]["progress"] = 10
        jobs[job_id]["currentStep"] = "자막을 분석하고 있습니다."

        video_id = extract_video_id(video_url)
        captions = get_captions(video_id)

        jobs[job_id]["progress"] = 30
        jobs[job_id]["currentStep"] = "추천 구간을 찾고 있습니다."
        candidates = find_candidates(captions, top_n=highlight_count)

        if not candidates:
            jobs[job_id]["status"] = "failed"
            jobs[job_id]["error"] = {"code": "ANALYSIS_FAILED", "message": "추천할 만한 구간을 찾지 못했습니다."}
            return

        highlights = []
        for i, cand in enumerate(candidates, start=1):
            jobs[job_id]["progress"] = 30 + int(60 * i / len(candidates))
            jobs[job_id]["currentStep"] = f"{i}/{len(candidates)}번째 구간의 콘텐츠를 생성하고 있습니다."
            highlights.append(score_and_generate(cand["caps"], i))

        highlights.sort(key=lambda h: h["score"], reverse=True)
        for i, h in enumerate(highlights, start=1):
            h["rank"] = i

        jobs[job_id].update({
            "status": "completed", "progress": 100,
            "currentStep": "분석이 완료되었습니다.", "highlights": highlights,
        })
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = {"code": "ANALYSIS_FAILED", "message": str(e)}


# ---------- 엔드포인트 ----------

@app.post("/api/analyses", status_code=202)
def create_analysis(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    try:
        extract_video_id(req.videoUrl)
    except ValueError:
        raise HTTPException(status_code=400, detail={"code": "INVALID_VIDEO_URL", "message": "올바른 유튜브 URL을 입력해주세요."})

    try:
        video_info = get_video_info(req.videoUrl)
    except Exception:
        raise HTTPException(status_code=404, detail={"code": "VIDEO_NOT_FOUND", "message": "영상을 찾을 수 없습니다."})

    job_id = f"job-{uuid.uuid4().hex[:8]}"
    jobs[job_id] = {"status": "queued", "progress": 0, "currentStep": "분석 대기 중", "video": video_info}

    background_tasks.add_task(run_analysis, job_id, req.videoUrl, req.targetLanguage, req.highlightCount)

    return {
        "success": True, "jobId": job_id, "status": "queued",
        "message": "영상 분석 요청이 접수되었습니다.", "video": video_info,
    }


@app.get("/api/analyses/{job_id}/status")
def get_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail={"code": "JOB_NOT_FOUND", "message": "작업 번호가 존재하지 않습니다."})
    if job["status"] == "failed":
        return {"success": False, "jobId": job_id, "status": "failed", "progress": 0, "error": job["error"]}
    return {
        "success": True, "jobId": job_id, "status": job["status"],
        "progress": job.get("progress", 0), "currentStep": job.get("currentStep", ""),
    }


@app.get("/api/analyses/{job_id}/result")
def get_result(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail={"code": "JOB_NOT_FOUND", "message": "작업 번호가 존재하지 않습니다."})
    if job["status"] == "failed":
        raise HTTPException(status_code=500, detail=job.get("error", {"code": "ANALYSIS_FAILED", "message": "분석 중 오류가 발생했습니다."}))
    if job["status"] != "completed":
        raise HTTPException(status_code=409, detail={"code": "ANALYSIS_NOT_COMPLETED", "message": "분석이 아직 끝나지 않았습니다."})
    return {"success": True, "jobId": job_id, "video": job["video"], "highlights": job["highlights"]}