export type Screen = 'start' | 'analyzing' | 'result' | 'final' | 'error';

// ===== 공통 =====

export type AnalysisStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface ApiErrorBody {
  code: string;
  message: string;
}

// ===== POST /api/analyses =====

export interface AnalyzeRequestBody {
  videoUrl: string;
  targetLanguage?: string;
  highlightCount?: number;
}

export interface AnalyzeResponse {
  success: true;
  jobId: string;
  status: 'queued';
  message: string;
  video?: VideoMeta;
}

// ===== GET /api/analyses/{jobId}/status =====

export interface StatusResponse {
  success: boolean;
  jobId: string;
  status: AnalysisStatus;
  progress: number;
  currentStep?: string;
  error?: ApiErrorBody;
}

// ===== GET /api/analyses/{jobId}/result =====

export interface TranscriptLine {
  start: number; // 초 단위
  end: number; // 초 단위
  ko: string;
  en: string;
}

export interface ScoreBreakdown {
  hook: number;
  completeness: number;
  lengthFit: number;
  specificity: number;
  emotion: number;
}

export interface GeneratedContent {
  title: string;
  description: string;
  hashtags: string[];
  thumbnailText: string;
  thumbnailTextAlt: string;
}

export interface Highlight {
  id: string;
  rank: number;
  startTime: number; // 초 단위
  endTime: number; // 초 단위
  duration: number; // 초 단위
  score: number; // 0~100
  scoreBreakdown: ScoreBreakdown;
  topic: string;
  reason: string;
  transcript: TranscriptLine[];
  generatedContent: GeneratedContent;
}

export interface VideoMeta {
  videoId: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number; // 초 단위
  sourceLanguage: string;
}

export interface AnalysisResult {
  success: true;
  jobId: string;
  video: VideoMeta;
  highlights: Highlight[];
}

// ===== 화면 전용 =====

export interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  status: 'done' | 'active' | 'waiting';
}
