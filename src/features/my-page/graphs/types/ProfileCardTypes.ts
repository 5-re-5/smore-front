export type ProfileApiResponse = {
  data: {
    user_id: number;
    name: string;
    email: string;
    nickname: string;
    profile_url: string;
    created_at: string;
    goal_study_time: number;
    level: string;
    target_date_title: string;
    target_date: string;
    determination: string;
    today_study_minute: number;
  };
};
