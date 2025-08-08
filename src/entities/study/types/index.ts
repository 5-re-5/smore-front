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
