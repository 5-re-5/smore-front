//MonthlyLineChartTypes.ts
export type ApiDayData = {
  date: string; // '2025-07-18'
  minutes: number;
};

export type MonthlyLineChartApiResponse = {
  user_id: number;
  total_attendance: number;
  weekday_graph: number[];
  weekly_graph: number[];
  study_track: {
    points: ApiDayData[];
  };
};
