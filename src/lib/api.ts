import type {
  AnalyzeResponse,
  AnalysisResult,
  ApiErrorBody,
  StatusResponse,
} from '../types';
import mockResultJson from '../mocks/mock.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// true(기본값): 백엔드 없이 mock.json으로 화면 개발
// false: 실제 백엔드로 연동
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// 명세서 3번 규칙: 2초 간격, 최대 90회(약 3분)
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_COUNT = 90;

/** API 에러 응답(명세서 6번 오류 코드 표)을 그대로 감싸는 에러 클래스 */
export class ApiError extends Error {
  code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.code = body.code;
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 공통 fetch 래퍼.
 * - JSON 요청/응답을 가정
 * - success:false 이거나 HTTP 에러면 ApiError로 통일해서 던짐
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // 네트워크 자체가 끊긴 경우 (서버 미실행, CORS 등)
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
    });
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ApiError({
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 응답을 해석할 수 없습니다.',
    });
  }

  const body = data as { success?: boolean; error?: ApiErrorBody };

  if (!res.ok || body.success === false) {
    throw new ApiError(
      body.error ?? { code: 'INTERNAL_SERVER_ERROR', message: '알 수 없는 오류가 발생했습니다.' },
    );
  }

  return data as T;
}

/** POST /api/analyses - 영상 분석 요청 */
export async function startAnalysis(
  videoUrl: string,
  targetLanguage = 'en',
  highlightCount = 3,
): Promise<AnalyzeResponse> {
  if (USE_MOCK) {
    await wait(300);
    return {
      success: true,
      jobId: 'mock-job-001',
      status: 'queued',
      message: '영상 분석 요청이 접수되었습니다. (mock)',
      video: (mockResultJson as AnalysisResult).video,
    };
  }

  return request<AnalyzeResponse>('/api/analyses', {
    method: 'POST',
    body: JSON.stringify({ videoUrl, targetLanguage, highlightCount }),
  });
}

// mock 모드에서 진행률이 흘러가는 것처럼 보여주기 위한 내부 카운터 (jobId별로 분리)
const mockPollCounts = new Map<string, number>();

/** GET /api/analyses/{jobId}/status */
export async function getStatus(jobId: string): Promise<StatusResponse> {
  if (USE_MOCK) {
    await wait(200);
    const count = (mockPollCounts.get(jobId) ?? 0) + 1;
    mockPollCounts.set(jobId, count);
    const progress = Math.min(count * 33, 100); // 33%씩 증가 → 약 3회 polling(약 6초)에 완료
    return {
      success: true,
      jobId,
      status: progress >= 100 ? 'completed' : 'processing',
      progress,
      currentStep:
        progress >= 100
          ? '분석이 완료되었습니다. (mock)'
          : '핵심 구간과 숏폼 문구를 생성하고 있습니다. (mock)',
    };
  }

  return request<StatusResponse>(`/api/analyses/${jobId}/status`);
}

/** GET /api/analyses/{jobId}/result */
export async function getResult(jobId: string): Promise<AnalysisResult> {
  if (USE_MOCK) {
    await wait(200);
    mockPollCounts.delete(jobId);
    // mock 모드에서는 targetLanguage와 무관하게 mock.json이 고정 반환.
    return { ...(mockResultJson as AnalysisResult), jobId };
  }

  return request<AnalysisResult>(`/api/analyses/${jobId}/result`);
}

interface PollOptions {
  onProgress: (status: StatusResponse) => void;
  signal?: AbortSignal;
}

/**
 * status가 completed 또는 failed가 될 때까지 2초 간격으로 polling.
 * 최대 90회(약 3분) 넘어가면 프론트 자체적으로 타임아웃 처리.
 */
export async function pollAnalysisStatus(
  jobId: string,
  { onProgress, signal }: PollOptions,
): Promise<StatusResponse> {
  for (let count = 0; count < MAX_POLL_COUNT; count++) {
    if (signal?.aborted) {
      throw new ApiError({ code: 'CANCELLED', message: '분석이 취소되었습니다.' });
    }

    const status = await getStatus(jobId);
    onProgress(status);

    if (status.status === 'completed' || status.status === 'failed') {
      return status;
    }

    await wait(POLL_INTERVAL_MS);
  }

  throw new ApiError({
    code: 'ANALYSIS_TIMEOUT',
    message: '분석이 3분을 넘겨 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
  });
}