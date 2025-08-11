export type ApiDayData = {
  date: string; // 예: '2025-07-18'
  minutes: number; // 공부 시간(분)
};

export type ApiResponse = {
  data: {
    user_id: number;
    total_attendance: number;
    weekday_graph: number[];
    weekly_graph: number[];
    this_month_track: { points: ApiDayData[] }; // 이번 달 데이터
    last_month_track: { points: ApiDayData[] }; // 지난 달 데이터
  };
};
