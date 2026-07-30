/** 초 단위 숫자를 mm:ss (1시간 이상이면 h:mm:ss) 문자열로 변환 */
export function formatTime(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 초 단위로 된 숫자를 입력받아서 문자열로 변환 */
/* formatDuration(66) → 1분 6초 */
export function formatDuration(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;

  if (m === 0) return `${s}초`;
  if (s === 0) return `${m}분`;
  return `${m}분 ${s}초`;
}

const LANGUAGE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

/** 언어 코드(ko)를 화면 표시용 라벨(한국어)로 변환 */
export function formatLanguage(code: string): string {
  return LANGUAGE_LABELS[code] ?? code.toUpperCase();
}