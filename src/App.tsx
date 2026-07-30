import { useState } from 'react';
import type { Screen } from './types';
import StartScreen from './components/StartScreen';
import AnalyzingScreen from './components/AnalyzingScreen';
import ResultScreen from './components/ResultScreen';
import FinalScreen from './components/FinalScreen';

export default function App() {
  // 전역 상태: 화면 전환 및 사용자 입력값을 App 최상단에서 useState로 관리
  const [screen, setScreen] = useState<Screen>('start');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  const resetAll = () => {
    setScreen('start');
    setVideoUrl('');
    setSelectedSegmentId(null);
  };

  return (
    <>
      {screen === 'start' && (
        <StartScreen
          videoUrl={videoUrl}
          onVideoUrlChange={setVideoUrl}
          onStart={() => setScreen('analyzing')}
        />
      )}

      {screen === 'analyzing' && (
        <AnalyzingScreen
          onComplete={() => setScreen('result')}
          onCancel={() => setScreen('start')}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          selectedSegmentId={selectedSegmentId}
          onSelectSegment={setSelectedSegmentId}
          onViewMaterials={() => setScreen('final')}
          onRestart={resetAll}
          onReanalyze={() => setScreen('analyzing')}
        />
      )}

      {screen === 'final' && <FinalScreen onRestart={resetAll} />}
    </>
  );
}
