export interface RecentStudyRoom {
  roomId: number;
  title: string;
  owner: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  tag: string[];
  thumbnailUrl: string;
}

export interface RecentStudyResponse {
  rooms: RecentStudyRoom[];
}

export interface StudyRoom {
  roodId: number;
  title: string;
  thumbnail: string;
  tags: readonly string[];
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  createdAt?: string;
  createrNickname: string;
  isPrivate: boolean;
  isPomodoro: boolean;
  isError: boolean;
}
