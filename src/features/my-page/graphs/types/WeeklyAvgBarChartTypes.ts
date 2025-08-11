export type WeeklyAvgBarChartApiResponse = {
  data: {
    weekly_graph: number[]; // 1~5주차 공부 시간(시간 단위)
  };
};
