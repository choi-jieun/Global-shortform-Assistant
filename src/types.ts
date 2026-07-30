export type Screen = 'start' | 'analyzing' | 'result' | 'final';

export type StepStatus = 'done' | 'active' | 'waiting';

export interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

export interface Segment {
  id: string;
  index: number;
  startTime: string;
  endTime: string;
  duration: string;
  positionPercent: number; // where the segment marker sits on the timeline (0-100)
  title: string;
  description: string;
  reason: string;
  score: number; // 0-100
}

export interface SubtitleLine {
  time: string;
  ko: string;
  en: string;
}

export interface VideoMeta {
  title: string;
  duration: string;
  language: string;
  source: string;
}

export interface ShortsResult {
  video: VideoMeta;
  segments: Segment[];
  subtitles: SubtitleLine[];
  suggestedTitle: string;
  description: string;
  hashtags: string[];
  thumbnailText: string;
  thumbnailAltText: string;
}
