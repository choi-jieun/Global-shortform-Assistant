import { useState } from 'react';
import { ArrowRight, Link2, FileSearch, Sparkles, PackageCheck } from 'lucide-react';
import Header from './Header';
import { exampleLinks } from '../data/mockData';

interface StartScreenProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onStart: () => void;
}

const steps = [
  {
    icon: FileSearch,
    title: '영상을 읽습니다',
    lines: ['음성을 한국어 텍스트로 옮기고', '장면 흐름을 파악합니다'],
  },
  {
    icon: Sparkles,
    title: 'AI가 숏츠 구간을 고릅니다',
    lines: ['발화 밀도와 화제 전환을 기준으로', '30~60초 구간을 추천합니다'],
  },
  {
    icon: PackageCheck,
    title: '숏폼 소재를 만듭니다',
    lines: ['영어 번역 자막과 제목·설명·', '해시태그를 생성합니다'],
  },
];

export default function StartScreen({ videoUrl, onVideoUrlChange, onStart }: StartScreenProps) {
  const [error, setError] = useState(false);

  const handleStart = () => {
    if (!videoUrl.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onStart();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-20 sm:px-6">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-3xl font-bold leading-tight text-ink sm:text-[45px] sm:leading-[54px]">
            긴 영상에서 글로벌 숏폼 소재를
            <br className="hidden sm:block" /> 찾아 드립니다
          </h1>
          <p className="mx-auto mt-6 max-w-lg font-serif text-base leading-relaxed text-muted">
            매경미디어 영상 링크를 넣으면 숏츠 추천 구간과 한국어·영어 자막,
            제목·설명·해시태그까지 한 번에 만들어 줍니다.
          </p>
        </div>

        {/* URL input */}
        <div className="mt-10">
          <div className="flex flex-col gap-3 rounded-xl border-2 border-brand bg-white/40 p-2 shadow-[inset_0_0_10px_rgba(255,157,0,0.25)] sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <Link2 size={18} className="shrink-0 text-muted" />
              <input
                value={videoUrl}
                onChange={(e) => {
                  onVideoUrlChange(e.target.value);
                  if (error) setError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder="영상 링크를 붙여넣으세요"
                className="w-full bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
              />
            </div>
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-brand px-6 py-3 text-[15px] font-bold text-white transition-transform hover:brightness-105 active:scale-[0.98]"
            >
              START
              <ArrowRight size={16} />
            </button>
          </div>
          {error && (
            <p className="mt-2 text-[12px] text-brand">영상 링크를 먼저 입력해 주세요.</p>
          )}
        </div>

        {/* How to AI work */}
        <div className="mt-20">
          <h2 className="text-center text-lg font-bold text-ink">How to AI work?</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-xl border border-border bg-white p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-[14px] font-bold text-brand">
                    {i + 1}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5">
                    <Icon size={15} className="text-brand" />
                    <h3 className="text-[15px] font-bold text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">
                    {step.lines[0]}
                    <br />
                    {step.lines[1]}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-[10.8px] text-muted">
            ※ 영상 파일 자동 편집·생성은 지원하지 않습니다.
          </p>
        </div>

        {/* Example links */}
        <div className="mt-10 text-center">
          <p className="text-[12px] text-muted">Try an example link first!</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {exampleLinks.map((ex) => (
              <button
                key={ex.url}
                onClick={() => onVideoUrlChange(ex.url)}
                className="rounded-md border border-border-strong bg-white px-4 py-2 text-[12px] text-muted transition-colors hover:border-brand hover:text-brand"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
