export type WeeklyBarChartApiResponse = {
  data: {
    weekday_graph: number[]; // 월~일 요일별 공부시간(단위: 시간, length 7)
    // ...필요시 기타 필드 추가(예: user_id 등)
  };
};
