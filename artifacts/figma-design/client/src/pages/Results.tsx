import { useState } from "react";
import { useLocation } from "wouter";

// ── Mock data ────────────────────────────────────────────────────────────────

const SEGMENT_LABEL = "구간 2";

const subtitles = [
  {
    time: "00:00",
    ko: "김치가 왜 시간이 갈수록 더 맛있어지는지 아세요?",
    en: "Do you know why kimchi gets better over time?",
  },
  {
    time: "00:05",
    ko: "바로 발효 때문이에요.",
    en: "It's all because of fermentation.",
  },
  {
    time: "00:09",
    ko: "유산균이 자라면서 김치를 변화시키거든요.",
    en: "Lactic acid bacteria grow and transform the kimchi.",
  },
  {
    time: "00:14",
    ko: "이 과정이 딱 빵 반죽 발효랑 같아요.",
    en: "This process is exactly like bread dough fermentation.",
  },
  {
    time: "00:20",
    ko: "온도가 낮을수록 발효가 천천히 되고",
    en: "The lower the temperature, the slower the fermentation,",
  },
  {
    time: "00:27",
    ko: "그러면 맛이 더 깊어지거든요.",
    en: "and that means the flavor gets much deeper.",
  },
  {
    time: "00:33",
    ko: "국물 맛이 훨씬 진해집니다.",
    en: "The broth gets much richer.",
  },
];

const TITLE = "3 Secrets to Perfect Korean Kimchi Stew";
const TITLE_NOTE = "39자 · 권장 60자 이내";

const BIO_LINES = [
  "A Korean home-cooking show reveals the golden ratio for kimchi stew.",
  "Fully fermented kimchi, pork shoulder, and one spoon of sugar —",
  "that's all it takes.",
];
const BIO_NOTE = "182자 · 권장 500자 이내";

const HASHTAGS = [
  "#KimchiStew",
  "#KoreanFood",
  "#KFood",
  "#HomeCooking",
  "#Kimchi",
  "#KoreanRecipe",
  "#MBNGlobal",
  "#Shorts",
];

const THUMBNAIL_TEXT = "Why Kimchi Stew Gets Better With Age 🍲";

// ── Helpers ──────────────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return { copied, copy };
}

function CopyBtn({
  id,
  text,
  label = "복사",
  copied,
  onCopy,
}: {
  id: string;
  text: string;
  label?: string;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  const active = copied === id;
  return (
    <button
      type="button"
      onClick={() => onCopy(id, text)}
      className={[
        "flex-shrink-0 text-[11px] font-bold transition-colors",
        active ? "text-[#2e9e5b]" : "text-[#ff6a13] hover:text-[#e95d0b]",
      ].join(" ")}
    >
      {active ? "복사됨!" : label}
    </button>
  );
}

function SectionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[7px] border border-[#ebedf0] bg-white px-[18px] py-[14px]">
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const Results = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { copied, copy } = useCopy();

  const allEnText = subtitles.map((s) => s.en).join("\n");
  const allKoText = subtitles.map((s) => s.ko).join("\n");
  const allSubtitles = subtitles
    .map((s) => `${s.time}  ${s.ko}  ${s.en}`)
    .join("\n");

  const allText = [
    "── 자막 ──",
    allSubtitles,
    "",
    "── 추천 제목 ──",
    TITLE,
    "",
    "── 영상 설명 ──",
    BIO_LINES.join("\n"),
    "",
    "── 해시태그 ──",
    HASHTAGS.join(" "),
    "",
    "── 썸네일 문구 ──",
    THUMBNAIL_TEXT,
  ].join("\n");

  return (
    <main className="min-h-screen bg-white [font-family:'Inter',Helvetica] text-[#2b2f36]">
      {/* Header */}
      <header className="border-b border-[#eeeeee]">
        <div className="mx-auto flex h-[35px] max-w-[800px] items-center justify-between px-[27px]">
          <a
            href="/"
            className="flex items-center gap-[6px] text-[10px] font-bold tracking-[0] leading-none text-[#2b2f36]"
          >
            <span className="h-[13px] w-[13px] rounded-[3px] bg-[#ff6a13]" aria-hidden="true" />
            MBN Global Shorts Finder
          </a>
          <span className="text-[7px] text-[#767c86]">더보기</span>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-[800px] px-[27px] pb-[72px] pt-[36px]">

        {/* ① Success heading */}
        <h1 className="text-[20px] font-semibold leading-[1.4] text-[#1e1e1e]">
          자막 · 영상제목 · 설명 · 해시태그 · 썸네일 문구를 만들었습니다!
        </h1>

        {/* ② 전체 복사 */}
        <div className="mt-[14px] flex justify-center">
          <button
            type="button"
            onClick={() => copy("all", allText)}
            className={[
              "rounded-[5px] border px-[20px] py-[6px] text-[12px] font-bold transition-colors",
              copied === "all"
                ? "border-[#2e9e5b] text-[#2e9e5b]"
                : "border-[#ff6a13] text-[#ff6a13] hover:bg-[#fff3ed]",
            ].join(" ")}
          >
            {copied === "all" ? "복사됨!" : "전체 복사"}
          </button>
        </div>

        {/* ── 자막 section ── */}
        <div className="mt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#2b2f36]">자막</h2>
            <CopyBtn
              id="sub-all"
              text={allSubtitles}
              label="전체 복사"
              copied={copied}
              onCopy={copy}
            />
          </div>

          <div className="mt-[10px] rounded-[7px] border border-[#ebedf0] overflow-hidden">
            {/* Segment label row */}
            <div className="border-b border-[#ebedf0] bg-[#fafafa] px-[14px] py-[7px]">
              <span className="text-[11px] text-[#767c86]">{SEGMENT_LABEL}</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[72px_1fr_1fr] border-b border-[#ebedf0] bg-[#f5f6f7] px-[14px] py-[7px] text-[11px] font-bold text-[#767c86]">
              <span>시간</span>
              <span>한국어 자막</span>
              <span>영어 번역</span>
            </div>

            {/* Subtitle rows */}
            {subtitles.map((row, idx) => (
              <div
                key={row.time}
                className={[
                  "grid grid-cols-[72px_1fr_1fr] items-start px-[14px] py-[10px] text-[12px]",
                  idx < subtitles.length - 1 ? "border-b border-[#ebedf0]" : "",
                ].join(" ")}
              >
                <span className="font-mono text-[11px] text-[#767c86]">{row.time}</span>
                <span className="pr-[8px] text-[#2b2f36] leading-[1.5]">{row.ko}</span>
                <span className="text-[#2b2f36] leading-[1.5]">{row.en}</span>
              </div>
            ))}

            {/* Footer row */}
            <div className="flex items-center justify-between border-t border-[#ebedf0] bg-[#fafafa] px-[14px] py-[8px]">
              <span className="text-[10px] text-[#767c86]">총 7개 문장 · 36초</span>
              <div className="flex gap-[16px]">
                <CopyBtn id="sub-ko" text={allKoText} label="한국어 자막만 복사" copied={copied} onCopy={copy} />
                <CopyBtn id="sub-en" text={allEnText} label="영어 자막만 복사" copied={copied} onCopy={copy} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 제목 · 설명 · 해시태그 section ── */}
        <div className="mt-[36px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#2b2f36]">제목 · 설명 · 해시태그</h2>
            <CopyBtn
              id="meta-all"
              text={[TITLE, BIO_LINES.join(" "), HASHTAGS.join(" ")].join("\n\n")}
              label="전체 복사"
              copied={copied}
              onCopy={copy}
            />
          </div>

          {/* 추천 제목 */}
          <div className="mt-[12px]">
            <p className="mb-[6px] text-[11px] font-bold text-[#767c86]">추천 제목</p>
            <SectionBox>
              <div className="flex items-start justify-between gap-[12px]">
                <p className="text-[13px] font-bold text-[#2b2f36]">{TITLE}</p>
                <CopyBtn id="title" text={TITLE} copied={copied} onCopy={copy} />
              </div>
              <p className="mt-[6px] text-[10px] text-[#767c86]">{TITLE_NOTE}</p>
            </SectionBox>
          </div>

          {/* 영상 설명 */}
          <div className="mt-[12px]">
            <p className="mb-[6px] text-[11px] font-bold text-[#767c86]">영상 설명(bio)</p>
            <SectionBox>
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex flex-col gap-[2px]">
                  {BIO_LINES.map((line) => (
                    <p key={line} className="text-[12px] text-[#2b2f36] leading-[1.6]">
                      {line}
                    </p>
                  ))}
                </div>
                <CopyBtn id="bio" text={BIO_LINES.join("\n")} copied={copied} onCopy={copy} />
              </div>
              <p className="mt-[8px] text-[10px] text-[#767c86]">{BIO_NOTE}</p>
            </SectionBox>
          </div>

          {/* 해시태그 */}
          <div className="mt-[12px]">
            <p className="mb-[6px] text-[11px] font-bold text-[#767c86]">해시태그</p>
            <SectionBox>
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex flex-wrap gap-[6px]">
                  {HASHTAGS.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#ebedf0] bg-[#fafafa] px-[10px] py-[3px] text-[11px] text-[#2b2f36]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CopyBtn id="hashtags" text={HASHTAGS.join(" ")} copied={copied} onCopy={copy} />
              </div>
            </SectionBox>
          </div>
        </div>

        {/* ── 썸네일 문구 section ── */}
        <div className="mt-[36px]">
          <h2 className="text-[22px] font-bold text-[#2b2f36]">썸네일 문구</h2>
          <div className="mt-[12px]">
            <SectionBox>
              <div className="flex items-center justify-between gap-[12px]">
                <p className="text-[13px] font-bold text-[#2b2f36]">{THUMBNAIL_TEXT}</p>
                <CopyBtn id="thumb" text={THUMBNAIL_TEXT} copied={copied} onCopy={copy} />
              </div>
            </SectionBox>
          </div>
        </div>

        {/* ── 처음으로 button ── */}
        <div className="mt-[48px] flex justify-center">
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="flex items-center gap-[6px] rounded-[6px] border border-[#ebedf0] px-[24px] py-[9px] text-[13px] text-[#2b2f36] hover:bg-[#f5f6f7]"
          >
            처음으로
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#eeeeee]" aria-hidden="true" />
    </main>
  );
};
