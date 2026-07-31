import { useState } from 'react';
import type { AnalysisResult, ApiErrorBody, Screen, VideoMeta } from './types';
import { ApiError, startAnalysis } from './lib/api';
import StartScreen from './components/StartScreen';
import AnalyzingScreen from './components/AnalyzingScreen';
import ResultScreen from './components/ResultScreen';
import FinalScreen from './components/FinalScreen';
import ErrorScreen from './components/ErrorScreen';

export default function App() {
  // 전역 상태: 화면 전환 및 분석 데이터를 App 최상단에서 useState로 관리
  const [screen, setScreen] = useState<Screen>('start');
  const [videoUrl, setVideoUrl] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<ApiErrorBody | null>(null);

  const resetAll = () => {
    setScreen('start');
    setVideoUrl('');
    setJobId(null);
    setVideoMeta(null);
    setResult(null);
    setSelectedHighlightId(null);
    setErrorInfo(null);
  };

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setErrorInfo({ code: err.code, message: err.message });
    } else {
      setErrorInfo({ code: 'INTERNAL_SERVER_ERROR', message: '알 수 없는 오류가 발생했습니다.' });
    }
    setScreen('error');
  };

  // START 버튼: POST /api/analyses 로 분석 요청 후 분석 화면으로 이동
  const handleStart = async () => {
    try {
      const res = await startAnalysis(videoUrl);
      setJobId(res.jobId);
      setVideoMeta(res.video ?? null);
      setScreen('analyzing');
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      {screen === 'start' && (
        <StartScreen videoUrl={videoUrl} onVideoUrlChange={setVideoUrl} onStart={handleStart} />
      )}

      {screen === 'analyzing' && jobId && (
        <AnalyzingScreen
          jobId={jobId}
          videoMeta={videoMeta}
          onComplete={(res) => {
            setResult(res);
            setScreen('result');
          }}
          onError={handleError}
          onCancel={resetAll}
        />
      )}

      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          selectedHighlightId={selectedHighlightId}
          onSelectHighlight={setSelectedHighlightId}
          onViewMaterials={() => setScreen('final')}
          onRestart={resetAll}
          onReanalyze={handleStart}
        />
      )}

      {screen === 'final' && result && (
        <FinalScreen
          result={result}
          selectedHighlightId={selectedHighlightId}
          onRestart={resetAll}
        />
      )}

      {screen === 'error' && errorInfo && (
        <ErrorScreen error={errorInfo} onRetry={resetAll} />
      )}
    </>
  );
}
