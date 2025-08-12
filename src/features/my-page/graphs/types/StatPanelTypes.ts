export type FocusTimeData = {
  start: string;
  end: string;
  avg_focus_score: number;
};

export type StatPanelApiResponse = {
  data: {
    ai_insights: {
      feedback: string;
      best_focus_time: FocusTimeData;
      worst_focus_time: FocusTimeData;
      average_focus_duration: number; // 분 단위
      focus_track: {
        labels: string[];
        scores: number[];
      };
    };
  };
};
