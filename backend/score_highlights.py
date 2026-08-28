import json

WINDOW_SIZE = 45      # 후보 구간 길이(초)
STEP = 5               # 슬라이딩 간격(초)
GAP_THRESHOLD = 3      # 이 이상 비면 "말이 끊긴 구간"으로 감점
TOP_N = 3              # 최종 추천 개수

with open("caption_data.json", "r", encoding="utf-8") as f:
    captions = json.load(f)

for c in captions:
    c["end"] = c["start"] + c["duration"]

video_end = max(c["end"] for c in captions)

def window_captions(w_start, w_end):
    return [c for c in captions if w_start <= c["start"] < w_end]

candidates = []
w_start = 0
while w_start + WINDOW_SIZE <= video_end:
    w_end = w_start + WINDOW_SIZE
    caps_in = window_captions(w_start, w_end)

    if len(caps_in) >= 2:
        total_chars = sum(len(c["text"]) for c in caps_in)
        density = total_chars / WINDOW_SIZE  # 초당 글자수

        gap_count = 0
        for i in range(1, len(caps_in)):
            gap = caps_in[i]["start"] - caps_in[i - 1]["end"]
            if gap > GAP_THRESHOLD:
                gap_count += 1

        raw_score = density - gap_count * 2
        candidates.append({"start": w_start, "end": w_end, "raw_score": raw_score, "caps": caps_in})

    w_start += STEP

    if not candidates:
        print("추천할 만한 구간을 찾지 못했습니다.")
        raise SystemExit(0)

    max_raw = max(c["raw_score"] for c in candidates)
for c in candidates:
    c["score"] = round(max(0, c["raw_score"]) / max_raw * 100)

candidates.sort(key=lambda c: c["score"], reverse=True)

selected = []
for c in candidates:
    overlap = any(not (c["end"] <= s["start"] or c["start"] >= s["end"]) for s in selected)
    if not overlap:
        selected.append(c)
    if len(selected) == TOP_N:
        break

for i, s in enumerate(selected, 1):
    preview = " ".join(cap["text"] for cap in s["caps"])[:80]
    print(f"{i}위 | {s['start']}~{s['end']}초 | score {s['score']} | {preview}...")