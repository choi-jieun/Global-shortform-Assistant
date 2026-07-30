import type { ShortsResult } from '../types';

export const exampleLinks = [
  { label: '《알토란》 김치찌개 편', url: 'https://mbn.example.com/altoran/kimchi-jjigae' },
  { label: 'MBN 뉴스와이드 물가 특집', url: 'https://mbn.example.com/newswide/prices' },
];

export const mockResult: ShortsResult = {
  video: {
    title: '《알토란》 김치찌개 편',
    duration: '50:12',
    language: '한국어',
    source: '매경미디어',
  },
  segments: [
    {
      id: 'seg-1',
      index: 1,
      startTime: '04:12',
      endTime: '04:48',
      duration: '36초',
      positionPercent: 12,
      title: '황금 비율 3가지',
      description: '재료 비율을 숫자로 짚어 주는 구간. 정보 밀도가 높고 도입부가 명확합니다.',
      reason:
        '초반 8초 안에 "황금 비율"이라는 명확한 약속을 제시하고, 숫자 기반 정보로 시청 지속률이 높게 나타나는 패턴과 일치합니다.',
      score: 92,
    },
    {
      id: 'seg-2',
      index: 2,
      startTime: '20:41',
      endTime: '21:22',
      duration: '41초',
      positionPercent: 42,
      title: '발효 원리 설명',
      description: '김치가 익는 과정을 비유로 풀어 설명합니다. 해외 시청자에게 배경 지식이 됩니다.',
      reason:
        '해외 시청자가 낯설어할 수 있는 발효 개념을 비유로 풀어내 이해도를 높이고, 문화적 맥락을 자연스럽게 전달합니다.',
      score: 81,
    },
    {
      id: 'seg-3',
      index: 3,
      startTime: '42:18',
      endTime: '42:52',
      duration: '34초',
      positionPercent: 84,
      title: '완성 시식 장면',
      description: '리액션이 강해 도입 3초 안에 시선을 끌기 좋습니다.',
      reason: '강한 표정 변화와 리액션은 숏폼 도입부 이탈률을 낮추는 대표적인 요소입니다.',
      score: 69,
    },
  ],
  subtitles: [
    { time: '00:00', ko: '자, 오늘의 핵심은', en: "OK, here's today's key point" },
    { time: '00:04', ko: '알토란 같은 비법이죠', en: 'This is a hidden gem of a tip' },
    { time: '00:09', ko: '김치는 푹 익은 걸로', en: 'Use fully fermented kimchi' },
    { time: '00:14', ko: '집밥의 정석입니다', en: 'Classic Korean home cooking' },
    { time: '00:19', ko: '돼지고기는 앞다리살', en: 'Pork shoulder works best' },
    { time: '00:24', ko: '설탕 한 스푼이 포인트', en: 'One spoon of sugar is the trick' },
    { time: '00:30', ko: '국물이 진해집니다', en: 'The broth gets much richer' },
  ],
  suggestedTitle: '3 Secrets to Perfect Korean Kimchi Stew',
  description:
    'A Korean home-cooking show reveals the golden ratio for kimchi stew. Fully fermented kimchi, pork shoulder, and one spoon of sugar — that\'s all it takes.',
  hashtags: [
    '#KimchiStew',
    '#KoreanFood',
    '#KFood',
    '#HomeCooking',
    '#Kimchi',
    '#KoreanRecipe',
    '#MBNGlobal',
    '#Shorts',
    '#FoodTok',
  ],
  thumbnailText: 'THE GOLDEN RATIO',
  thumbnailAltText: 'KIMCHI STEW, PERFECTED',
};
