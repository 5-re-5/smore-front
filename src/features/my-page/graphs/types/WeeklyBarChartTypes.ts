// src/features/my-page/graphs/types/WeeklyBarChartTypes.ts
export type WeeklyBarChartApiResponse = {
  weekday_graph: number[]; // 월~일 요일별 공부시간(단위: 시간, length 7)
  // 필요 시 total_attendance, weekly_graph, study_track 등 추가 가능
};
