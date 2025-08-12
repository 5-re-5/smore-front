import { useState, useEffect } from 'react';
import { fetchStatPanel } from '../api/StatPanelApi';
import type { StatPanelApiResponse } from '../types/StatPanelTypes';

// 목데이터
const mockData: StatPanelApiResponse['data']['ai_insights'] = {
  feedback: '아침형 스타일입니다. 오전 6시~8시에 집중력이 가장 좋습니다.',
  best_focus_time: { start: '06:00', end: '08:00', avg_focus_score: 92 },
  worst_focus_time: { start: '13:00', end: '14:00', avg_focus_score: 55 },
  average_focus_duration: 65,
  focus_track: {
    labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    scores: Array(24).fill(75),
  },
};

function formatFocusTime(start: string, end: string) {
  const format = (t: string) => {
    const [h] = t.split(':');
    const hour = Number(h);
    if (hour === 0) return '오전 12시';
    if (hour < 12) return `오전 ${hour}시`;
    if (hour === 12) return '오후 12시';
    return `오후 ${hour - 12}시`;
  };
  return `${format(start)}~${format(end)}`;
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

export function useStatPanel(userId: string) {
  const [panel, setPanel] = useState<
    StatPanelApiResponse['data']['ai_insights'] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStatPanel(userId)
      .then((res) => setPanel(res.data.ai_insights))
      .catch(() => setPanel(mockData))
      .finally(() => setLoading(false));
  }, [userId]);

  return { panel, loading, formatFocusTime, formatMinutes };
}
