import { useEffect, useState } from 'react';
import { getAiFocusInsights } from '../api/AiFocusLineChartApi';
import type { AiInsights } from '../types/AiFocusLineChartTypes';

const mockData: AiInsights = {
  feedback:
    '아침형 스타일입니다. 등교 전 오전에 50분 집중 후 10분 휴식을 추천드립니다 😊',
  bestFocusTime: { start: '09:00', end: '11:00', avgFocusScore: 92 },
  worstFocusTime: { start: '14:00', end: '16:00', avgFocusScore: 70 },
  averageFocusDuration: 180,
  focusTrack: {
    labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    scores: [
      80, 76, 81, 78, 85, 74, 92, 79, 75, 82, 88, 70, 69, 74, 80, 76, 86, 83,
      72, 77, 90, 91, 81, 79,
    ],
  },
};

export const useAiFocusInsights = (userId: string) => {
  const [data, setData] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] useAiFocusInsights userId:', userId);

    if (!userId) {
      console.warn('[WARN] userId 없음 → mockData 사용');
      setData(mockData);
      setLoading(false);
      return;
    }

    getAiFocusInsights(userId)
      .then((res) => {
        console.log('[DEBUG] API 응답:', res);
        setData(res.data.aiInsights);
      })
      .catch((err) => {
        console.error('[ERROR] API 실패 → mockData 사용', err);
        setData(mockData);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading };
};
