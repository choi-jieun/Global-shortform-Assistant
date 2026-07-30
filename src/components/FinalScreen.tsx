import { useState } from 'react';
import { Home, Sparkles, RefreshCw } from 'lucide-react';
import Header from './Header';
import CopyButton from './ui/CopyButton';
import { mockResult } from '../data/mockData';

interface FinalScreenProps {
  onRestart: () => void;
}

export default function FinalScreen({ onRestart }: FinalScreenProps) {
  const { subtitles, suggestedTitle, description, hashtags, thumbnailText, thumbnailAltText } =
    mockResult;
  const [showAltThumbnail, setShowAltThumbnail] = useState(false);

  const allKoText = subtitles.map((s) => `${s.time} ${s.ko}`).join('\n');
  const allEnText = subtitles.map((s) => `${s.time} ${s.en}`).join('\n');
  const allSubtitlesText = subtitles.map((s) => `${s.time}  ${s.ko} / ${s.en}`).join('\n');
  const hashtagsText = hashtags.join(' ');
  const currentThumbnail = showAltThumbnail ? thumbnailAltText : thumbnailText;

  const everythingText = [
    `[제목] ${suggestedTitle}`,
    `[설명] ${description}`,
    `[해시태그] ${hashtagsText}`,
    `[썸네일 문구] ${currentThumbnail}`,
    '',
    '[자막]',
    allSubtitlesText,
  ].join('\n');

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 sm:px-6">
        {/* Banner */}
        <div className="flex flex-col gap-4 rounded-2xl border border-ink bg-ink px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-brand" />
            <h1 className="text-lg font-semibold leading-snug sm:text-[22px]">
              자막 · 영상제목 · 설명 · 해시태그 · 썸네일 문구를 만들었습니다!
            </h1>
          </div>
          <CopyButton
            text={everythingText}
            label="전체 복사"
            className="shrink-0 rounded-md bg-brand px-4 py-2 !text-white"
          />
        </div>

        {/* Subtitles */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink sm:text-[30px]">자막</h2>
            <CopyButton
              text={allSubtitlesText}
              label="전체 복사"
              className="rounded-md border border-brand bg-brand-soft px-3 py-1.5"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[70px_1fr_1fr] bg-surface-soft px-4 py-2 text-[11px] font-bold text-muted">
              <span>시간</span>
              <span>한국어 자막</span>
              <span>영어 번역</span>
            </div>
            {subtitles.map((line, i) => (
              <div
                key={line.time}
                className={`grid grid-cols-[70px_1fr_1fr] items-center px-4 py-3 text-[13px] ${
                  i !== subtitles.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span className="text-[11px] font-bold text-muted">{line.time}</span>
                <span className="pr-3 text-ink">{line.ko}</span>
                <span className="border-l border-border pl-3 text-ink">{line.en}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-muted">총 {subtitles.length}개 문장 · 36초</span>
            <div className="flex gap-4">
              <CopyButton text={allKoText} label="한국어 자막만 복사" />
              <CopyButton text={allEnText} label="영어 자막만 복사" />
            </div>
          </div>
        </section>

        {/* Title / description / hashtags */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-ink sm:text-[30px]">제목 · 설명 · 해시태그</h2>

          {/* Title */}
          <div className="mt-6">
            <p className="text-[12px] font-bold text-muted">추천 제목</p>
            <div className="mt-2 flex items-start justify-between gap-3 rounded-lg border border-border-strong bg-white p-4">
              <p className="text-[15px] font-bold text-ink">{suggestedTitle}</p>
              <CopyButton text={suggestedTitle} />
            </div>
            <p className="mt-1 text-[11px] text-muted">{suggestedTitle.length}자 · 권장 60자 이내</p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-[12px] font-bold text-muted">영상 설명(bio)</p>
            <div className="mt-2 flex items-start justify-between gap-3 rounded-lg border border-border-strong bg-white p-4">
              <p className="text-[13px] leading-relaxed text-ink">{description}</p>
              <CopyButton text={description} className="shrink-0" />
            </div>
            <p className="mt-1 text-[11px] text-muted">{description.length}자 · 권장 500자 이내</p>
          </div>

          {/* Hashtags */}
          <div className="mt-6">
            <p className="text-[12px] font-bold text-muted">해시태그</p>
            <div className="mt-2 rounded-lg border border-border-strong bg-[#FCFCFD] p-4">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-soft px-3 py-1 text-[12px] text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <CopyButton text={hashtagsText} />
              </div>
            </div>
          </div>

          {/* Thumbnail text */}
          <div className="mt-6">
            <p className="text-[12px] font-bold text-muted">썸네일 문구</p>
            <div className="mt-2 rounded-lg border border-border-strong bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-bold tracking-wide text-ink">{currentThumbnail}</p>
                <CopyButton text={currentThumbnail} />
              </div>
              <p className="mt-1 text-[11px] text-muted">짧고 굵게 · 대문자 권장</p>

              <button
                onClick={() => setShowAltThumbnail((v) => !v)}
                className="mt-3 flex items-center gap-1 text-[12px] font-bold text-muted hover:text-brand"
              >
                <RefreshCw size={12} />
                다른 문구 제안
                <span className="ml-1 font-bold text-ink">
                  {showAltThumbnail ? thumbnailText : thumbnailAltText}
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-5 py-3 text-[14px] text-ink transition-colors hover:bg-surface-soft"
          >
            <Home size={15} />
            처음으로
          </button>
          <CopyButton
            text={everythingText}
            label="전체 복사"
            className="flex flex-1 items-center justify-center rounded-lg bg-brand py-3 text-[14px] font-bold !text-white"
          />
        </div>
      </div>
    </div>
  );
}
