import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "1",
    title: "영상 정보 불러오기",
    description: "제목 · 길이 · 썸네일 확인",
    status: "completed" as const,
  },
  {
    number: "2",
    title: "한국어 자막 생성",
    description: "음성 인식으로 대사를 텍스트로 옮기는 중",
    status: "completed" as const,
  },
  {
    number: "3",
    title: "추천 구간 찾기",
    description: "발화 밀도와 화제 전환 기준으로 탐색 중",
    status: "in-progress" as const,
  },
  {
    number: "4",
    title: "영어 번역 자막 생성",
    description: "미국 시청자 기준 표현으로 번역",
    status: "pending" as const,
  },
  {
    number: "5",
    title: "제목 · 설명 · 해시태그 생성",
    description: "구간별 메타데이터 작성",
    status: "pending" as const,
  },
];

const statusColors = {
  completed: {
    circle: "bg-[#e8f7ef] border border-[#2e9e5b]",
    label: "#2e9e5b",
    badge: "완료",
    icon: "✓",
  },
  "in-progress": {
    circle: "bg-[#fff3ed] border border-[#ff6a13]",
    label: "#ff6a13",
    badge: "진행 중",
    icon: "",
  },
  pending: {
    circle: "bg-[#f5f6f7] border border-[#c8ccd2]",
    label: "#767c86",
    badge: "대기",
    icon: "",
  },
};

function WaveBar({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block w-[3px] rounded-full bg-[#ff6a13] opacity-80"
      style={{
        height: "28px",
        animation: "waveAnim 1.1s ease-in-out infinite",
        animationDelay: delay,
      }}
    />
  );
}

export const Analyzing = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <main className="min-h-[692px] overflow-hidden bg-white [font-family:'Inter',Helvetica] text-[#2b2f36]">
      <style>{`
        @keyframes waveAnim {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>

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

      {/* Main content */}
      <section className="mx-auto flex max-w-[800px] flex-col items-center px-6 pt-[100px] text-center">
        {/* Title */}
        <h1 className="text-[27px] font-bold tracking-[-1px] leading-[1.2] text-[#2b2f36]">
          분석 중 ...
        </h1>
        <p className="mt-[10px] text-[11px] text-[#767c86]">
          약 3~5분 걸립니다.
        </p>

        {/* Waveform visualization */}
        <div className="mt-[32px] flex items-center justify-center gap-[5px] h-[48px]">
          {["0s","0.1s","0.2s","0.3s","0.4s","0.5s","0.6s","0.7s","0.8s","0.9s","1.0s","0.9s","0.8s","0.7s","0.6s","0.5s","0.4s","0.3s","0.2s","0.1s","0s"].map(
            (delay, i) => (
              <WaveBar key={i} delay={delay} />
            )
          )}
        </div>

        {/* Progress steps */}
        <div className="mt-[32px] w-full max-w-[576px]">
          {steps.map((step, index) => {
            const style = statusColors[step.status];
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number}>
                {/* Step row */}
                <div className="flex items-center gap-[12px] py-[10px]">
                  {/* Circle */}
                  <div
                    className={`flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${style.circle}`}
                    style={{ color: style.label }}
                  >
                    {step.status === "completed" ? (
                      <span style={{ color: "#2e9e5b" }}>✓</span>
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-1 flex-col items-start gap-[3px]">
                    <span className="text-[12px] font-bold text-[#2b2f36] leading-none">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-[#767c86] leading-none">
                      {step.description}
                    </span>
                  </div>

                  {/* Status badge */}
                  <span
                    className="flex-shrink-0 text-[11px] font-bold"
                    style={{ color: style.label }}
                  >
                    {style.badge}
                  </span>
                </div>

                {/* Divider */}
                {!isLast && (
                  <div className="h-px w-full bg-[#ebedf0]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Cancel button */}
        <Button
          type="button"
          onClick={handleCancel}
          className="mt-[32px] h-[34px] w-[120px] rounded-[6px] bg-[#2b2f36] text-[12px] font-bold text-white hover:bg-[#1e2229]"
        >
          취소
        </Button>
      </section>

      {/* Footer border */}
      <footer className="mt-[60px] border-t border-[#eeeeee]" aria-hidden="true" />
    </main>
  );
};
