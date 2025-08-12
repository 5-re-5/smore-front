export type FocusTrack = {
  labels: string[]; // ["00", "01", ..., "23"]
  scores: number[]; // 0~100 범위
};

export type AiInsights = {
  feedback: string;
  bestFocusTime: {
    start: string;
    end: string;
    avgFocusScore: number;
  };
  worstFocusTime: {
    start: string;
    end: string;
    avgFocusScore: number;
  };
  averageFocusDuration: number;
  focusTrack: FocusTrack;
};

// request<T>의 T 타입을 data 안에 들어가는 실제 페이로드 형태로 맞춤
export type AiInsightsApiResponse = {
  aiInsights: AiInsights;
};
