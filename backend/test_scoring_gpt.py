import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

with open("caption_data.json", "r", encoding="utf-8") as f:
    captions = json.load(f)

for c in captions:
    c["end"] = c["start"] + c["duration"]

WINDOW_START = 225
WINDOW_END = 270

segment_captions = [c for c in captions if WINDOW_START <= c["start"] < WINDOW_END]

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

transcript_text = "\n".join(f"[{c['start']}s] {c['text']}" for c in segment_captions)

prompt = f"""다음은 한 요리 영상에서 {WINDOW_START}~{WINDOW_END}초 구간의 한국어 자막입니다.

{transcript_text}

이 구간을 유튜브 숏폼(Shorts) 후보로 평가해줘. 아래 JSON 형식으로만 답해.

{{
  "scoreBreakdown": {{
    "hook": (1~5, 구간 시작 3~5초 안에 궁금증/반전을 유발하는가),
    "completeness": (1~5, 앞뒤 문맥 없이 이 구간만 봐도 이해되는가),
    "specificity": (1~5, 막연한 설명이 아니라 수치·비율 등 구체적인 정보인가),
    "emotion": (1~5, '몰랐던 상식' 등 감정적 반응을 유발하는가)
  }},
  "topic": "이 구간의 핵심 주제 한 줄",
  "reason": "숏폼 후보로 추천하는 이유 한두 문장",
  "transcript": [
    {{"start": 시작초, "end": 종료초, "ko": "한국어 문장", "en": "영어 번역"}}
  ],
  "generatedContent": {{
    "title": "영어 숏폼 제목",
    "description": "영어 설명 1~2문장",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
    "thumbnailText": "썸네일에 들어갈 짧은 영어 문구"
  }}
}}

transcript 배열은 위 자막 줄들을 자연스러운 문장 단위로 합치거나 나눠서, start/end가 서로 겹치지 않게 순서대로 구성해줘."""

response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[
        {"role": "developer", "content": "너는 유튜브 롱폼 영상에서 숏폼 후보 구간을 평가하고 콘텐츠를 생성하는 어시스턴트야. 반드시 JSON만 출력해."},
        {"role": "user", "content": prompt}
    ],
    response_format={"type": "json_object"}
)

result = json.loads(response.choices[0].message.content)

# 자막 줄 시간을 정수로 반올림
for line in result["transcript"]:
    line["start"] = round(line["start"])
    line["end"] = round(line["end"])

# highlight의 시작/끝을 실제 자막 경계에 맞춤 (윈도우 값 대신)
start_time = result["transcript"][0]["start"]
end_time = result["transcript"][-1]["end"]
duration = end_time - start_time

breakdown = result["scoreBreakdown"]
breakdown["lengthFit"] = length_fit_score(duration)

final_score = round(
    (breakdown["hook"] * 0.3
     + breakdown["completeness"] * 0.25
     + breakdown["lengthFit"] * 0.15
     + breakdown["specificity"] * 0.2
     + breakdown["emotion"] * 0.1) * 20
)

highlight = {
    "id": "highlight-001",
    "rank": 1,
    "startTime": start_time,
    "endTime": end_time,
    "duration": duration,
    "score": final_score,
    "scoreBreakdown": breakdown,
    "topic": result["topic"],
    "reason": result["reason"],
    "transcript": result["transcript"],
    "generatedContent": result["generatedContent"]
}

print(json.dumps(highlight, ensure_ascii=False, indent=2))