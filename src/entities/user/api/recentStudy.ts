import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { RecentStudyResponse, RecentStudyRoom } from '@/entities/study';
import { DEFAULT_PROFILE_IMG } from '@/shared/constants';

interface RawRecentStudyRoom {
  roomId: number;
  title: string;
  owner: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  tag: string;
  thumbnailUrl: string;
  isDelete: boolean;
}

interface RawRecentStudyResponse {
  rooms: RawRecentStudyRoom[];
}

const adaptRecentStudyData = (
  rawData: RawRecentStudyResponse,
): RecentStudyResponse => {
  return {
    rooms: rawData.rooms.map(
      (room): RecentStudyRoom => ({
        roomId: room.roomId,
        title: room.title,
        owner: room.owner,
        category: room.category,
        maxParticipants: room.maxParticipants,
        currentParticipants: room.currentParticipants,
        tag: room.tag
          ? room.tag
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t.length > 0)
          : [],
        thumbnailUrl: room.thumbnailUrl || DEFAULT_PROFILE_IMG,
        isDelete: room.isDelete,
      }),
    ),
  };
};

export const getRecentStudy = async (userId: string) => {
  const response = await request<RawRecentStudyResponse>({
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${userId}/recent-study`,
    method: REQUEST_METHOD.GET,
  });
  return adaptRecentStudyData(response.data);
};
