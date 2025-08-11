import { useState, useEffect } from 'react';
import { fetchStatPanel } from '../api/StatPanelApi';
import type { StatPanelApiResponse } from '../types/StatPanelTypes';

// 목데이터 예시
const mockData: StatPanelApiResponse = {
  data: {
    ai_insights: {
      feedback:
        '아침형 스타일입니다. 등교 전 오전에 50분 집중 후 10분 휴식을 추천드립니다 😊',
      best_focus_time: { start: '06:00', end: '08:00', avg_focus_score: 92 },
      worst_focus_time: { start: '13:00', end: '14:00', avg_focus_score: 55 },
      average_focus_duration: 65, // 1시간 5분
      focus_track: {
        labels: [
          '00',
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
        ],
        scores: Array(24).fill(75),
      },
    },
  },
};

export function useStatPanel(userId: string) {
  const [data, setData] = useState<
    StatPanelApiResponse['data']['ai_insights'] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStatPanel(userId)
      .then((res) => setData(res.data.ai_insights))
      .catch(() => setData(mockData.data.ai_insights))
      .finally(() => setLoading(false));
  }, [userId]);

  return { panel: data, loading };
}
