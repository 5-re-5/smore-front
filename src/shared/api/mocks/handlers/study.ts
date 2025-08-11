import { http, HttpResponse } from 'msw';
import { mockStudyRooms } from '@/entities/room/api/mockData';

export const studyRoomHandlers = [
  // 스터디룸 목록 조회 (Page 기반)
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const sort = url.searchParams.get('sort') || 'latest';
      const category = url.searchParams.get('category');
      const hideFullRooms = url.searchParams.get('hideFullRooms') === 'true';

      console.log('🎯 MSW: Intercepted study-rooms request (page-based):', {
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

      // Page를 cursor로 사용 (page = 이전 페이지의 마지막 roomId)
      if (page && page !== 1) {
        const cursorIndex = filteredRooms.findIndex(
          (room) => room.roomId === page,
        );

        if (cursorIndex !== -1) {
          // cursor 다음부터 가져오기
          filteredRooms = filteredRooms.slice(cursorIndex + 1);
        }
      }

      // 제한된 개수만 반환
      const paginatedRooms = filteredRooms.slice(0, limit);
      const hasNext = filteredRooms.length > limit;

      const responseData = {
        data: {
          cursorId:
            paginatedRooms.length > 0
              ? paginatedRooms[paginatedRooms.length - 1].roomId.toString()
              : null,
          size: paginatedRooms.length,
          content: paginatedRooms,
          hasNext,
          nextCursor:
            paginatedRooms.length > 0
              ? paginatedRooms[paginatedRooms.length - 1].roomId
              : null,
        },
      };

      console.log(
        '✅ MSW: Returning study rooms (page-based):',
        responseData.data,
      );

      return HttpResponse.json(responseData);
    },
  ),

  // 스터디룸 참가 API
  // http.post(
  //   `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/:roomId/join`,
  //   ({ params }) => {
  //     const roomId = parseInt(params.roomId as string);

  //     console.log(
  //       '🎯 MSW: Intercepted study-room join request for roomId:',
  //       roomId,
  //     );

  //     const room = mockStudyRooms.find((room) => room.roomId === roomId);

  //     if (!room) {
  //       return HttpResponse.json(
  //         { error: '스터디룸을 찾을 수 없습니다.' },
  //         { status: 404 },
  //       );
  //     }

  //     // 정원 초과 체크
  //     if (room.currentParticipants >= room.maxParticipants) {
  //       return HttpResponse.json(
  //         { error: '참가 정원이 가득 찼습니다.' },
  //         { status: 400 },
  //       );
  //     }

  //     // 성공 응답 (JoinRoomResponse 형식)
  //     const responseData = {
  //       data: {
  //         accessToken: `mock-token-${roomId}-${Date.now()}`,
  //         roomName: room.title,
  //         identity: `User${Math.floor(Math.random() * 1000)}`,
  //         expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1시간 후
  //         canPublish: true,
  //         canSubscribe: true,
  //         createdAt: new Date().toISOString(),
  //       },
  //     };

  //     console.log('✅ MSW: Returning join success:', responseData.data);

  //     return HttpResponse.json(responseData);
  //   },
  // ),

  // PrejoinPage용 Room API (MSW 데이터 활용)
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/:roomId`,
    ({ params }) => {
      const roomId = parseInt(params.roomId as string);

      console.log(
        '🎯 MSW: Intercepted room detail request for roomId:',
        roomId,
      );

      const room = mockStudyRooms.find((room) => room.roomId === roomId);

      if (!room) {
        return HttpResponse.json(
          { error: '스터디룸을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      // PrejoinPage가 기대하는 형식으로 변환 (camelCase)
      const responseData = {
        data: {
          roomId: room.roomId,
          title: room.title,
          description: room.description || '관리자가 전합니다. 항상 파이팅~~!!',
          thumbnailUrl: room.thumbnailUrl,
          tag: room.tag.join(','), // 배열을 문자열로
          category: room.category,
          focusTime: room.isPomodoro ? 25 : null,
          breakTime: room.isPomodoro ? 5 : null,
          maxParticipants: room.maxParticipants,
          currentParticipants: room.currentParticipants,
          password: room.isPrivate ? 'test123' : null,
          createdAt: room.createdAt,
          creator: {
            userId: 12345,
            nickname: room.creator.nickname,
          },
        },
      };

      console.log('✅ MSW: Returning room detail:', responseData.data);

      return HttpResponse.json(responseData);
    },
  ),

  // LiveKit 토큰 생성 API
  http.post(`${import.meta.env.VITE_BACK_URL}/token`, async ({ request }) => {
    const body = (await request.json()) as {
      roomName: string;
      participantName: string;
    };

    console.log('🎯 MSW: Intercepted token request:', body);

    // Mock LiveKit 토큰 생성
    const mockToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.mock-token-${Date.now()}`;

    console.log('✅ MSW: Returning token:', mockToken);

    return HttpResponse.json(mockToken, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }),
];
