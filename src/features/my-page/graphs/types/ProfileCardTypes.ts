export type ProfileApiResponse = {
  data: {
    userId: number;
    name: string;
    email: string;
    nickname: string;
    profileUrl: string;
    createdAt: string;
    goalStudyTime: number;
    level: string;
    targetDateTitle: string;
    targetDate: string;
    determination: string;
    todayStudyMinute: number;
  };
};
