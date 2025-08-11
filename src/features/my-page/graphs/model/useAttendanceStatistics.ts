import { useState, useEffect } from 'react';

type AttendanceApiResponse = {
  data: {
    total_attendance: number;
    weekday_graph: number[];
    weekly_graph: number[];
    study_track: {
      points: { date: string; minutes: number }[];
    };
  };
};

export function useAttendanceStatistics(userId: string) {
  const [attendance, setAttendance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/v1/study-times/statistics/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('출석 정보 조회 실패');
        return res.json() as Promise<AttendanceApiResponse>;
      })
      .then((data) => {
        setAttendance(data.data?.total_attendance ?? 0);
      })
      .catch((err) => {
        setError(err);
        setAttendance(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return { attendance, loading, error };
}
