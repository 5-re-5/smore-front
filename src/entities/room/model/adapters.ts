import { type Room, type RoomApiResponse } from './types';

// API 응답을 도메인 모델로 변환하는 adapter
export const adaptRoomFromApi = (apiResponse: RoomApiResponse): Room => {
  const { data } = apiResponse;

  return {
    id: data.roomId,
    title: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    tags: data.tag ? data.tag.split(',').map((tag: string) => tag.trim()) : [],
    category: data.category,
    focusTime: data.focusTime ?? undefined,
    breakTime: data.breakTime ?? undefined,
    maxParticipants: data.maxParticipants,
    currentParticipants: data.currentParticipants,
    hasPassword: !!data.password,
    createdAt: new Date(data.createdAt),
    creatorId: data.creator.userId,
    creatorName: data.creator.nickname,
  };
};

// 필요시 도메인 모델을 API 요청 형태로 변환
export const adaptRoomToApi = (
  room: Partial<Room>,
): Record<string, unknown> => {
  return {
    title: room.title,
    description: room.description,
    thumbnailUrl: room.thumbnailUrl,
    tag: room.tags?.join(','),
    category: room.category,
    focusTime: room.focusTime,
    breakTime: room.breakTime,
    maxParticipants: room.maxParticipants,
  };
};
