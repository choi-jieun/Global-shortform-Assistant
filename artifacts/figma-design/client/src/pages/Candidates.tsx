import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface Candidate {
  id: number;
  label: string;
  timeRange: string;
  duration: string;
  title: string;
  description: string;
  score: number;
  timelineStart: number; // % into timeline
  timelineWidth: number; // % width
}

const candidates: Candidate[] = [
  {
    id: 1,
    label: "구간 1",
    timeRange: "05:22 – 06:11",
    duration: "49초",
    title: "재료 손질 시연",
    description:
      "재료를 손질하며 요리법을 직접 보여주는 장면입니다. 해외 시청자에게 직관적으로 전달되는 도입부입니다.",
    score: 91,
    timelineStart: 10.7,
    timelineWidth: 1.6,
  },
  {
    id: 2,
    label: "구간 2",
    timeRange: "20:41 – 21:22",
    duration: "41초",
    title: "발효 원리 설명",
    description:
      "김치가 익는 과정을 비유로 풀어 설명합니다. 해외 시청자에게 배경 지식이 됩니다.",
    score: 84,
    timelineStart: 41.2,
    timelineWidth: 1.4,
  },
  {
    id: 3,
    label: "구간 3",
    timeRange: "42:18 – 42:52",
    duration: "34초",
    title: "완성 시식 장면",
    description:
      "리액션이 강해 도입 3초 안에 시선을 끌기 좋습니다.",
    score: 69,
    timelineStart: 84.3,
    timelineWidth: 1.1,
  },
];

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-end gap-[4px]">
      <span className="text-[9px] font-bold text-[#767c86]">추천 점수</span>
      <div className="relative h-[5px] w-[72px] rounded-full bg-[#f0f1f3]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#ff6a13]"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[12px] font-bold text-[#ff6a13]">{score}</span>
    </div>
  );
}

function PreviewThumb() {
  return (
    <div className="flex h-[102px] w-[130px] flex-shrink-0 flex-col items-center justify-center gap-[6px] rounded-[6px] bg-[#f5f6f7]">
      {/* Play icon */}
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="11" fill="#e4e6e9" />
        <polygon points="9,7 17,11 9,15" fill="#767c86" />
      </svg>
      <span className="text-[9px] text-[#767c86]">구간 미리보기</span>
    </div>
  );
}

export const Candidates = (): JSX.Element => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const handleCardClick = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleConfirm = () => {
    if (selectedId !== null) {
      // Navigate to results (future screen)
      alert(`구간 ${selectedId} 선택됨 – 결과 화면은 다음 단계에서 구현됩니다.`);
    }
  };

  const handleReanalyze = () => {
    setLocation("/");
  };

  return (
    <main className="min-h-screen bg-white [font-family:'Inter',Helvetica] text-[#2b2f36]">
      {/* Header */}
      <header className="border-b border-[#eeeeee]">
        <div className="mx-auto flex h-[35px] max-w-[800px] items-center justify-between px-[27px]">
          <a
            href="/"
            className="flex items-center gap-[6px] text-[10px] font-bold tracking-[0] leading-none text-[#2b2f36]"
          >
            <span
              className="h-[13px] w-[13px] rounded-[3px] bg-[#ff6a13]"
              aria-hidden="true"
            />
            MBN Global Shorts Finder
          </a>
          <span className="text-[7px] text-[#767c86]">더보기</span>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-[800px] px-[27px] pt-[48px] pb-[60px]">
        {/* Heading */}
        <h1 className="text-center text-[24px] font-bold leading-[1.2] text-black">
          숏폼 추천 구간 3개를 찾았습니다!
        </h1>

        {/* Timeline */}
        <div className="mt-[24px]">
          <div className="relative h-[8px] w-full rounded-full bg-[#ebedf0]">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="absolute top-0 h-full rounded-full bg-[#ff6a13]"
                style={{
                  left: `${c.timelineStart}%`,
                  width: `${Math.max(c.timelineWidth, 1.2)}%`,
                }}
              />
            ))}
          </div>
          <div className="mt-[4px] flex justify-between text-[9px] text-[#767c86]">
            <span>00:00</span>
            <span>원본 50:12</span>
          </div>
        </div>

        {/* Candidate cards */}
        <div className="mt-[20px] flex flex-col gap-[10px]">
          {candidates.map((c) => {
            const isSelected = selectedId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                className={[
                  "flex cursor-pointer items-stretch gap-[16px] rounded-[8px] border px-[16px] py-[14px] transition-all",
                  isSelected
                    ? "border-[2px] border-[#ff6a13] shadow-[0_0_0_1px_#ff6a13]"
                    : "border border-[#ebedf0] hover:border-[#ffbb92]",
                ].join(" ")}
              >
                {/* Thumbnail */}
                <PreviewThumb />

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  {/* Top row: label + time */}
                  <div className="flex items-baseline gap-[8px]">
                    <span className="text-[11px] font-bold text-[#767c86]">
                      {c.label}
                    </span>
                    <span className="text-[11px] text-[#767c86]">
                      {c.timeRange} · {c.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="mt-[6px] text-[15px] font-bold text-[#2b2f36]">
                    {c.title}
                  </p>

                  {/* Description */}
                  <p className="mt-[4px] text-[11px] leading-[1.5] text-[#767c86]">
                    {c.description}
                  </p>

                  {/* Footer row */}
                  <div className="mt-[8px] flex items-center gap-[10px]">
                    <span className="text-[9px] font-bold text-[#767c86]">
                      핵심 내용
                    </span>
                    <button
                      type="button"
                      className="text-[10px] font-bold text-[#ff6a13] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      추천이유 자세히 보기
                    </button>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-shrink-0 items-end">
                  <ScoreBar score={c.score} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA row */}
        <div className="mt-[24px] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReanalyze}
            className="text-[12px] font-normal text-[#ff6a13] hover:underline"
          >
            다시 분석
          </button>

          <Button
            type="button"
            disabled={selectedId === null}
            onClick={handleConfirm}
            className={[
              "h-[38px] rounded-[6px] px-[24px] text-[13px] font-bold text-white transition-colors",
              selectedId !== null
                ? "bg-[#ff6a13] hover:bg-[#e95d0b]"
                : "cursor-not-allowed bg-[#c8ccd2]",
            ].join(" ")}
          >
            선택 구간 제작 자료 보기
          </Button>
        </div>
      </section>

      {/* Footer border */}
      <footer className="border-t border-[#eeeeee]" aria-hidden="true" />
    </main>
  );
};
