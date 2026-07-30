import { useEffect, useState } from 'react';
import { Check, Loader2, Film, X } from 'lucide-react';
import Header from './Header';
import type { AnalysisStep } from '../types';
import { mockResult } from '../data/mockData';

interface AnalyzingScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

const initialSteps: AnalysisStep[] = [
  { id: 1, title: '영상 정보 불러오기', description: '제목 · 길이 · 썸네일 확인', status: 'done' },
  { id: 2, title: '한국어 자막 생성', description: '음성 인식으로 대사를 텍스트로 옮기는 중', status: 'done' },
  { id: 3, title: '추천 구간 찾기', description: '발화 밀도와 화제 전환 기준으로 탐색 중', status: 'active' },
  { id: 4, title: '영어 번역', description: '미국 시청자 기준 표현으로 번역', status: 'waiting' },
  { id: 5, title: '제목 · 설명 · 해시태그 생성', description: '구간별 메타데이터 작성', status: 'waiting' },
];

const statusLabel: Record<AnalysisStep['status'], string> = {
  done: '완료',
  active: '진행 중',
  waiting: '대기',
};

export default function AnalyzingScreen({ onComplete, onCancel }: AnalyzingScreenProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [progress, setProgress] = useState(55);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 5, 100);

        if (next >= 65 && next < 85) {
          setSteps((s) =>
            s.map((step) =>
              step.id === 3 ? { ...step, status: 'done' } : step.id === 4 ? { ...step, status: 'active' } : step,
            ),
          );
        }
        if (next >= 85) {
          setSteps((s) =>
            s.map((step) =>
              step.id === 4 ? { ...step, status: 'done' } : step.id === 5 ? { ...step, status: 'active' } : step,
            ),
          );
        }
        if (next >= 100) {
          setSteps((s) => s.map((step) => ({ ...step, status: 'done' })));
        }
        return next;
      });
    }, 500);

    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  const completedCount = steps.filter((s) => s.status === 'done').length;

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-ink sm:text-[35px]">분석 중 ...</h1>
          <p className="mt-2 text-[13px] text-muted">약 3~5분 걸립니다.</p>
        </div>

        {/* Video info card */}
        <div className="mt-8 flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-ink text-white">
            <Film size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-bold text-ink">{mockResult.video.title}</p>
            <p className="mt-1 text-[12px] text-muted">
              {mockResult.video.duration} · {mockResult.video.language} · {mockResult.video.source}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[14px] font-bold text-brand">{completedCount} / 5</p>
            <p className="mt-1 text-[12px] text-muted">남은 시간 약 2분</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-track">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[12px] font-bold text-muted">
            <span>{progress}% Complete</span>
            <span>100%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                step.status === 'active'
                  ? 'border-brand bg-brand-soft'
                  : step.status === 'done'
                    ? 'border-border bg-white'
                    : 'border-border bg-white'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-bold ${
                  step.status === 'done'
                    ? 'border-success bg-success-soft text-success'
                    : step.status === 'active'
                      ? 'border-brand bg-white text-brand'
                      : 'border-border-strong bg-surface-soft text-muted'
                }`}
              >
                {step.status === 'done' ? (
                  <Check size={14} />
                ) : step.status === 'active' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  step.id
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-bold ${
                    step.status === 'waiting' ? 'text-muted' : 'text-ink'
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-[12px] text-muted">{step.description}</p>
              </div>
              <span
                className={`shrink-0 text-[12px] font-bold ${
                  step.status === 'done'
                    ? 'text-success'
                    : step.status === 'active'
                      ? 'text-brand'
                      : 'text-muted'
                }`}
              >
                {statusLabel[step.status]}
              </span>
            </div>
          ))}
        </div>

        {/* Cancel */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-8 py-3 text-[14px] font-bold text-white transition-transform hover:brightness-105 active:scale-[0.98]"
          >
            <X size={15} />
            취소
          </button>
        </div>
      </main>
    </div>
  );
}
