export type FocusTrack = {
  labels: string[]; // ["00", "01", ..., "23"]
  scores: number[]; // [95, 93, ..., 81], 각 시간대별 평균 집중도 점수(0~100)
};

export type AiInsights = {
  feedback: string;
  average_focus_duration: number;
  focus_track: FocusTrack;
};

export type AiInsightsApiResponse = {
  data: {
    ai_insights: AiInsights;
  };
};
