import { type Room, type RoomApiResponse } from './types';

// API 응답을 도메인 모델로 변환하는 adapter
export const adaptRoomFromApi = (apiResponse: RoomApiResponse): Room => {
  const { data } = apiResponse;

  return {
    id: data.room_id,
    title: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    tags: data.tag ? data.tag.split(',').map((tag) => tag.trim()) : [],
    category: data.category,
    focusTime: data.focus_time ?? undefined,
    breakTime: data.break_time ?? undefined,
    maxParticipants: data.max_participants,
    currentParticipants: data.current_participants,
    hasPassword: !!data.password,
    createdAt: new Date(data.created_at),
    creatorId: data.creator.user_id,
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
    thumbnail_url: room.thumbnailUrl,
    tag: room.tags?.join(','),
    category: room.category,
    focus_time: room.focusTime,
    break_time: room.breakTime,
    max_participants: room.maxParticipants,
  };
};
