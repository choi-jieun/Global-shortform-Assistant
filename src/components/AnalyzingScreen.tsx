import { useEffect, useState } from 'react';
import { Check, Film, Loader2, X } from 'lucide-react';
import Header from './Header';
import type { AnalysisResult, VideoMeta } from '../types';
import { getResult, pollAnalysisStatus } from '../lib/api';
import { formatDuration, formatLanguage } from '../lib/format';

interface AnalyzingScreenProps {
  jobId: string;
  videoMeta: VideoMeta | null;
  onComplete: (result: AnalysisResult) => void;
  onError: (err: unknown) => void;
  onCancel: () => void;
}

type StepStatus = 'done' | 'active' | 'waiting';

// 화면 고정 5단계
// 백엔드는 progress(0~100)와 currentStep 텍스트만 주므로 프론트에서는 progress 구간을 나눠 몇 번째 단계인지만 매핑
const steps = [
  { threshold: 0, title: '영상 정보 불러오기', description: '제목 · 길이 · 썸네일 확인' },
  { threshold: 15, title: '한국어 자막 생성', description: '음성 인식으로 대사를 텍스트로 옮기는 중' },
  { threshold: 40, title: '추천 구간 찾기', description: '발화 밀도와 화제 전환 기준으로 탐색 중' },
  { threshold: 70, title: '영어 번역', description: '미국 시청자 기준 표현으로 번역' },
  { threshold: 90, title: '제목 · 설명 · 해시태그 생성', description: '구간별 메타데이터 작성' },
];

const statusLabel: Record<StepStatus, string> = { done: '완료', active: '진행 중', waiting: '대기' };

export default function AnalyzingScreen({
  jobId,
  videoMeta,
  onComplete,
  onError,
  onCancel,
}: AnalyzingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    let cancelled = false; // 이 effect 실행(run)에만 속하는 취소 플래그 — 다른 effect 실행과 절대 안 섞임

    async function run() {
      try {
        const finalStatus = await pollAnalysisStatus(jobId, {
          signal: abortController.signal,
          onProgress: (status) => setProgress(status.progress),
        });

        if (finalStatus.status === 'failed') {
          throw finalStatus.error
            ? Object.assign(new Error(finalStatus.error.message), { code: finalStatus.error.code })
            : new Error('분석에 실패했습니다.');
        }

        const result = await getResult(jobId);
        if (!cancelled) onComplete(result);
      } catch (err) {
        if (!cancelled) onError(err);
      }
    }

    run();

    return () => {
      cancelled = true;
      abortController.abort();
    };
    // jobId는 마운트 시 한 번만 사용 (재분석은 App에서 새로 마운트시킴)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const currentStepIndex = steps.reduce(
    (acc, step, i) => (progress >= step.threshold ? i : acc),
    0,
  );
  const completedCount = progress >= 100 ? steps.length : currentStepIndex;
  // 남은 시간 추정: 최대 3분(90회 polling) 기준 잔여 progress 비례 계산
  const remainingMinutes = Math.max(1, Math.ceil(((100 - progress) / 100) * 3));

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-14 sm:px-6">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-ink sm:text-[35px]">분석 중 ...</h1>
          <p className="mt-2 text-[13px] text-muted">최대 3분 정도 걸릴 수 있습니다.</p>
        </div>

        {/* Video info card */}
        {videoMeta && (
          <div className="mt-8 flex items-center gap-4 rounded-xl border border-border bg-white p-4">
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-ink text-white">
              <Film size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold text-ink">{videoMeta.title}</p>
              <p className="mt-1 text-[12px] text-muted">
                {formatDuration(videoMeta.duration)} · {formatLanguage(videoMeta.sourceLanguage)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[14px] font-bold text-brand">{completedCount} / {steps.length}</p>
              <p className="mt-1 text-[12px] text-muted">남은 시간 약 {remainingMinutes}분</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-track">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-3">
          {steps.map((step, i) => {
            const status: StepStatus = i < currentStepIndex || progress >= 100 ? 'done' : i === currentStepIndex ? 'active' : 'waiting';
            return (
              <div
                key={step.title}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  status === 'active' ? 'border-brand bg-brand-soft' : 'border-border bg-white'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-bold ${
                    status === 'done'
                      ? 'border-success bg-success-soft text-success'
                      : status === 'active'
                        ? 'border-brand bg-white text-brand'
                        : 'border-border-strong bg-surface-soft text-muted'
                  }`}
                >
                  {status === 'done' ? (
                    <Check size={14} />
                  ) : status === 'active' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[14px] font-bold ${status === 'waiting' ? 'text-muted' : 'text-ink'}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">{step.description}</p>
                </div>
                <span
                  className={`shrink-0 text-[12px] font-bold ${
                    status === 'done' ? 'text-success' : status === 'active' ? 'text-brand' : 'text-muted'
                  }`}
                >
                  {statusLabel[status]}
                </span>
              </div>
            );
          })}
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