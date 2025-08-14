//MonthlyLineChartTypes.ts
export type ApiDayData = {
  date: string; // '2025-07-18'
  minutes: number;
};

export type MonthlyLineChartApiResponse = {
  userId: number;
  totalAttendance: number;
  weekdayGraph: number[];
  weeklyGraph: number[];
  studyTrack: {
    points: ApiDayData[];
  };
};
