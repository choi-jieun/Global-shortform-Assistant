import { useState } from 'react';
import { RotateCcw, Film, ChevronDown, ChevronRight, Home } from 'lucide-react';
import Header from './Header';
import type { AnalysisResult } from '../types';
import { formatTime, formatDuration } from '../lib/format';

interface ResultScreenProps {
  result: AnalysisResult;
  selectedHighlightId: string | null;
  onSelectHighlight: (id: string) => void;
  onViewMaterials: () => void;
  onRestart: () => void;
  onReanalyze: () => void;
}

export default function ResultScreen({
  result,
  selectedHighlightId,
  onSelectHighlight,
  onViewMaterials,
  onRestart,
  onReanalyze,
}: ResultScreenProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { highlights, video } = result;

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-12 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-ink sm:text-[30px]">
            숏폼 추천 구간 {highlights.length}개를 찾았습니다!
          </h1>
          <button
            onClick={onReanalyze}
            className="mt-2 flex shrink-0 items-center gap-1 text-[12px] font-medium text-brand hover:underline"
          >
            <RotateCcw size={12} />
            다시 분석
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <div className="relative h-2 rounded-full bg-surface-track">
            {highlights.map((h) => (
              <button
                key={h.id}
                onClick={() => onSelectHighlight(h.id)}
                title={`${h.topic} (${formatTime(h.startTime)})`}
                className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-transform hover:scale-125 ${
                  selectedHighlightId === h.id ? 'bg-ink ring-2 ring-brand' : 'bg-brand'
                }`}
                style={{ left: `${(h.startTime / video.duration) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted">
            <span>00:00</span>
            <span>원본 {formatTime(video.duration)}</span>
          </div>
        </div>

        {/* Highlight cards */}
        <div className="mt-6 space-y-4">
          {highlights.map((h) => {
            const selected = selectedHighlightId === h.id;
            const expanded = expandedId === h.id;
            return (
              <div
                key={h.id}
                onClick={() => onSelectHighlight(h.id)}
                className={`cursor-pointer rounded-xl border bg-white p-4 transition-colors sm:p-5 ${
                  selected ? 'border-2 border-brand' : 'border-border hover:border-border-strong'
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink text-white">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={h.topic}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Film size={18} className={video.thumbnail ? 'hidden' : ''} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[11px] font-bold text-brand">구간 {h.rank}</span>
                      <span className="text-[11px] text-muted">
                        {formatTime(h.startTime)} – {formatTime(h.endTime)} · {formatDuration(h.duration)}
                      </span>
                    </div>
                    <h3 className="mt-1 text-[16px] font-bold text-ink">{h.topic}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{h.generatedContent.description}</p>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-[10px] font-bold text-muted">추천 점수</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-track">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${h.score}%` }} />
                      </div>
                      <span className="text-[12px] font-bold text-brand">{h.score}</span>
                    </div>
                  </div>
                </div>

                {/* mobile score */}
                <div className="mt-3 flex items-center gap-2 sm:hidden">
                  <span className="text-[10px] font-bold text-muted">추천 점수</span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-track">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${h.score}%` }} />
                  </div>
                  <span className="text-[12px] font-bold text-brand">{h.score}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(expanded ? null : h.id);
                  }}
                  className="mt-3 flex items-center gap-1 text-[11px] font-bold text-brand"
                >
                  <span className="text-[10px] font-bold text-muted">핵심 내용</span>
                  추천이유 자세히 보기
                  {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>

                {expanded && (
                  <p className="mt-2 rounded-lg bg-surface-soft p-3 text-[12px] leading-relaxed text-muted">
                    {h.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
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
          <button
            onClick={onViewMaterials}
            disabled={!selectedHighlightId}
            className="flex-1 rounded-lg bg-brand py-3 text-[14px] font-bold text-white transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            선택 구간 제작 자료 보기
          </button>
        </div>
      </div>
    </div>
  );
}
