import { AlertTriangle, RotateCcw } from 'lucide-react';
import Header from './Header';
import type { ApiErrorBody } from '../types';

interface ErrorScreenProps {
  error: ApiErrorBody;
  onRetry: () => void;
}

export default function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto flex max-w-md flex-col items-center px-4 pb-24 pt-24 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <AlertTriangle size={26} />
        </div>

        <h1 className="mt-6 text-[22px] font-bold text-ink">분석에 실패했습니다</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{error.message}</p>
        <p className="mt-1 text-[11px] text-muted">오류 코드: {error.code}</p>

        <button
          onClick={onRetry}
          className="mt-8 flex items-center gap-1.5 rounded-lg bg-brand px-8 py-3 text-[14px] font-bold text-white transition-transform hover:brightness-105 active:scale-[0.98]"
        >
          <RotateCcw size={15} />
          처음부터 다시 시도
        </button>
      </main>
    </div>
  );
}
