import { useInfiniteQuery } from '@tanstack/react-query';
import { request } from '@/shared/api/request';
import type { StudyRoom } from '@/entities/study';

interface StudyRoomsParams {
  limit?: number;
  search?: string;
  category?: string;
  sort?: 'latest' | 'popular';
  hideFullRooms?: boolean;
}

interface ApiStudyRoom {
  roomId: number;
  title: string;
  thumbnailUrl: string;
  tag: string[];
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  createdAt: string;
  isPomodoro: boolean;
  isPrivate: boolean;
  description?: string;
  creator: {
    nickname: string;
  };
}

interface StudyRoomsResponse {
  cursorId: string | null;
  size: number;
  content: ApiStudyRoom[];
  hasNextPage?: boolean;
}

const fetchStudyRooms = async (
  params: StudyRoomsParams & { cursorId?: string },
): Promise<StudyRoomsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.cursorId) searchParams.append('cursorId', params.cursorId);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.category) searchParams.append('category', params.category);
  if (params.sort) searchParams.append('sort', params.sort);
  if (params.hideFullRooms) searchParams.append('hideFullRooms', 'true');

  const response = await request<StudyRoomsResponse>({
    method: 'GET',
    url: `/api/v1/study-rooms?${searchParams.toString()}`,
  });
  return response.data;
};

// API 응답을 StudyRoom 타입으로 변환하는 함수
const transformApiRoomToStudyRoom = (apiRoom: ApiStudyRoom): StudyRoom => ({
  roomId: apiRoom.roomId,
  title: apiRoom.title,
  thumbnail: apiRoom.thumbnailUrl,
  tags: apiRoom.tag,
  category: apiRoom.category,
  maxParticipants: apiRoom.maxParticipants,
  currentParticipants: apiRoom.currentParticipants,
  isPomodoro: apiRoom.isPomodoro,
  isPrivate: apiRoom.isPrivate,
  createrNickname: apiRoom.creator.nickname,
  description: apiRoom.description,
});
//무한스크롤
export const useInfiniteStudyRoomsQuery = (params: StudyRoomsParams) => {
  return useInfiniteQuery({
    queryKey: ['study-rooms', params],
    queryFn: ({ pageParam }) =>
      fetchStudyRooms({ ...params, cursorId: pageParam as string }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage && lastPage.cursorId ? lastPage.cursorId : undefined,
    staleTime: 30000, // 30초간 캐시 유지
    select: (data) => ({
      pages: data.pages.map((page) => ({
        ...page,
        content: page.content.map(transformApiRoomToStudyRoom),
      })),
      pageParams: data.pageParams,
    }),
  });
};
