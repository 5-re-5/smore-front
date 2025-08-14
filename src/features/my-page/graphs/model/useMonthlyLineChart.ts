// useMonthlyLineChart.ts
import { useState, useEffect } from 'react';
import { fetchMonthlyStudyStatistics } from '../api/MonthlyLineChartApi';
import type { ApiResponseForm } from '@/shared/api/request';
import type {
  ApiDayData,
  MonthlyLineChartApiResponse,
} from '../types/MonthlyLineChartTypes';

const NUM_DAYS = 30;

/** 해당 연-월(1~12) 기준으로 1~30일까지 고정 배열 생성. 없는 날은 0분으로 채움 */
function buildMonthArray(
  year: number,
  month1to12: number,
  minutesByDate: Map<string, number>,
): ApiDayData[] {
  const mm = String(month1to12).padStart(2, '0');
  return Array.from({ length: NUM_DAYS }, (_, i) => {
    const day = i + 1;
    const dd = String(day).padStart(2, '0');
    const key = `${year}-${mm}-${dd}`;
    return { date: key, minutes: minutesByDate.get(key) ?? 0 };
  });
}

/** mock: 최신월/직전월 모두 0분 */
function buildMockTwoMonths(base: Date = new Date()) {
  const latest = new Date(base);
  const prev = new Date(latest.getFullYear(), latest.getMonth() - 1, 1);
  const empty = new Map<string, number>();

  return {
    thisMonth: buildMonthArray(
      latest.getFullYear(),
      latest.getMonth() + 1,
      empty,
    ),
    prevMonth: buildMonthArray(prev.getFullYear(), prev.getMonth() + 1, empty),
    thisMonthLabel: `${latest.getFullYear()}-${String(latest.getMonth() + 1).padStart(2, '0')}`,
    prevMonthLabel: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`,
  };
}

/** 가장 최신 날짜 찾기 */
function findLatestDate(points: ApiDayData[]): Date | null {
  if (!points?.length) return null;
  let maxT = -Infinity;
  for (const p of points) {
    const t = new Date(p.date).getTime();
    if (!Number.isNaN(t) && t > maxT) maxT = t;
  }
  return maxT === -Infinity ? null : new Date(maxT);
}

export function useMonthlyLineChart(userId: string) {
  const [thisMonth, setThisMonth] = useState<ApiDayData[]>([]);
  const [prevMonth, setPrevMonth] = useState<ApiDayData[]>([]);
  const [thisMonthLabel, setThisMonthLabel] = useState<string>('');
  const [prevMonthLabel, setPrevMonthLabel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      const mock = buildMockTwoMonths();
      setThisMonth(mock.thisMonth);
      setPrevMonth(mock.prevMonth);
      setThisMonthLabel(mock.thisMonthLabel);
      setPrevMonthLabel(mock.prevMonthLabel);
      setError('userId 없음');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMonthlyStudyStatistics(userId)
      .then((res: ApiResponseForm<MonthlyLineChartApiResponse>) => {
        const points = res.data?.studyTrack?.points ?? [];
        const latestDate = findLatestDate(points);

        if (!latestDate) {
          const mock = buildMockTwoMonths();
          setThisMonth(mock.thisMonth);
          setPrevMonth(mock.prevMonth);
          setThisMonthLabel(mock.thisMonthLabel);
          setPrevMonthLabel(mock.prevMonthLabel);
          return;
        }

        // 최신월/직전월 계산
        const latestY = latestDate.getFullYear();
        const latestM0 = latestDate.getMonth(); // 0~11
        const prevDate = new Date(latestY, latestM0 - 1, 1);

        // 날짜별 분 맵 구성
        const minutesByDate = new Map<string, number>();
        for (const p of points) {
          if (!p?.date) continue;
          const key = p.date.slice(0, 10); // YYYY-MM-DD
          minutesByDate.set(key, p.minutes ?? 0);
        }

        const tm = buildMonthArray(latestY, latestM0 + 1, minutesByDate);
        const pm = buildMonthArray(
          prevDate.getFullYear(),
          prevDate.getMonth() + 1,
          minutesByDate,
        );

        setThisMonth(tm);
        setPrevMonth(pm);
        setThisMonthLabel(
          `${latestY}-${String(latestM0 + 1).padStart(2, '0')}`,
        );
        setPrevMonthLabel(
          `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`,
        );
      })
      .catch((err) => {
        console.error('[MonthlyLineChart] API 실패 → mock 사용', err);
        setError(err?.message ?? 'API 오류');
        const mock = buildMockTwoMonths();
        setThisMonth(mock.thisMonth);
        setPrevMonth(mock.prevMonth);
        setThisMonthLabel(mock.thisMonthLabel);
        setPrevMonthLabel(mock.prevMonthLabel);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return {
    thisMonth,
    prevMonth,
    thisMonthLabel,
    prevMonthLabel,
    loading,
    error,
  };
}
