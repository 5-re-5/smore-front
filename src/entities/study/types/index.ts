export interface RecentStudyRoom {
  roomId: number;
  title: string;
  owner: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  tag: string[];
  thumbnailUrl: string;
  isDelete: boolean;
}

export interface RecentStudyResponse {
  rooms: RecentStudyRoom[];
}

export interface StudyRoom {
  roomId: number;
  title: string;
  thumbnail: string;
  tags: readonly string[];
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  createdAt?: string;
  creatorNickname: string;
  isPrivate: boolean;
  isPomodoro: boolean;
  description?: string;
  // isError: boolean;
}
