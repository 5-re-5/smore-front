import { http, HttpResponse } from 'msw';

// 모킹된 스터디룸 데이터
const mockStudyRooms = [
  {
    roomId: 1,
    title: '알고리즘 스터디 집인데 집가고 싶어요~~~아자아자파이팅',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=156&h=193&fit=crop&crop=center',
    tag: ['알고리즘', '코딩테스트', '파이썬'],
    category: '취업',
    maxParticipants: 6,
    currentParticipants: 4,
    createdAt: '2025-01-10T10:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: '함께 알고리즘 문제를 풀어보며 실력을 향상시켜요!',
    creator: {
      nickname: '알고리즘마스터',
    },
  },
  {
    roomId: 2,
    title: '영어 회화 연습',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=156&h=193&fit=crop&crop=center',
    tag: ['영어', '회화', '스피킹'],
    category: '어학',
    maxParticipants: 4,
    currentParticipants: 3,
    createdAt: '2025-01-10T09:00:00Z',
    isPomodoro: false,
    isPrivate: true,
    description: '매일 30분씩 영어로 대화하며 실력을 늘려봐요!',
    creator: {
      nickname: '영어선생님',
    },
  },
  {
    roomId: 3,
    title: 'React 심화 스터디',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=156&h=193&fit=crop&crop=center',
    tag: ['React', 'TypeScript', '프론트엔드'],
    category: '자율',
    maxParticipants: 5,
    currentParticipants: 5,
    createdAt: '2025-01-10T08:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: 'React 고급 패턴과 최적화 기법을 함께 학습해요!',
    creator: {
      nickname: 'React개발자',
    },
  },
  {
    roomId: 4,
    title: 'Java 백엔드 스터디',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=156&h=193&fit=crop&crop=center',
    tag: ['Java', 'Spring', '백엔드'],
    category: '취업',
    maxParticipants: 6,
    currentParticipants: 2,
    createdAt: '2025-01-10T07:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: 'Spring Boot로 실전 프로젝트를 만들어봐요!',
    creator: {
      nickname: 'Java마스터',
    },
  },
  {
    roomId: 5,
    title: 'TOEIC 990점 달성',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=156&h=193&fit=crop&crop=center',
    tag: ['TOEIC', '토익', '영어시험'],
    category: '자격증',
    maxParticipants: 8,
    currentParticipants: 6,
    createdAt: '2025-01-10T06:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: '함께 TOEIC 고득점을 목표로 열심히 공부해요!',
    creator: {
      nickname: 'TOEIC고수',
    },
  },
];

export const studyRoomHandlers = [
  // 스터디룸 목록 조회
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const sort = url.searchParams.get('sort') || 'latest';
      const category = url.searchParams.get('category');
      const hideFullRooms = url.searchParams.get('hideFullRooms') === 'true';

      console.log('🎯 MSW: Intercepted study-rooms request:', {
        page,
        limit,
        sort,
        category,
        hideFullRooms,
      });

      let filteredRooms = [...mockStudyRooms];

      // 카테고리 필터링
      if (category) {
        filteredRooms = filteredRooms.filter(
          (room) => room.category === category,
        );
      }

      // 바로 참여 가능 필터링
      if (hideFullRooms) {
        filteredRooms = filteredRooms.filter(
          (room) => room.currentParticipants < room.maxParticipants,
        );
      }

      // 정렬
      if (sort === 'latest') {
        filteredRooms.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      } else if (sort === 'popular') {
        filteredRooms.sort(
          (a, b) => b.currentParticipants - a.currentParticipants,
        );
      }

      // 페이지네이션
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

      const responseData = {
        data: {
          cursorId:
            paginatedRooms.length > 0
              ? paginatedRooms[paginatedRooms.length - 1].roomId
              : null,
          size: paginatedRooms.length,
          content: paginatedRooms,
        },
      };

      console.log('✅ MSW: Returning study rooms:', responseData.data);

      return HttpResponse.json(responseData);
    },
  ),

  // 개별 스터디룸 정보 조회 (prejoin에서 사용할 수 있음)
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/:roomId`,
    ({ params }) => {
      const roomId = parseInt(params.roomId as string);

      console.log(
        '🎯 MSW: Intercepted study-room detail request for roomId:',
        roomId,
      );

      const room = mockStudyRooms.find((room) => room.roomId === roomId);

      if (!room) {
        return HttpResponse.json(
          { error: '스터디룸을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const responseData = {
        data: room,
      };

      console.log('✅ MSW: Returning study room detail:', responseData.data);

      return HttpResponse.json(responseData);
    },
  ),
];
