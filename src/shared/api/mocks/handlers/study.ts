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
  {
    roomId: 6,
    title: '정보처리기사 자격증 준비',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=156&h=193&fit=crop&crop=center',
    tag: ['정보처리기사', '자격증', 'IT'],
    category: '자격증',
    maxParticipants: 10,
    currentParticipants: 7,
    createdAt: '2025-01-10T05:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: '정처기 실기와 필기를 함께 준비해봐요!',
    creator: {
      nickname: 'IT자격증전문가',
    },
  },
  {
    roomId: 7,
    title: 'Vue.js 프로젝트 스터디',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=156&h=193&fit=crop&crop=center',
    tag: ['Vue', 'JavaScript', '프론트엔드'],
    category: '자율',
    maxParticipants: 6,
    currentParticipants: 4,
    createdAt: '2025-01-10T04:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: 'Vue 3 Composition API로 실무 프로젝트 개발!',
    creator: {
      nickname: 'Vue마스터',
    },
  },
  {
    roomId: 8,
    title: 'IELTS 스피킹 연습',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=156&h=193&fit=crop&crop=center',
    tag: ['IELTS', '영어', '스피킹'],
    category: '어학',
    maxParticipants: 4,
    currentParticipants: 2,
    createdAt: '2025-01-10T03:00:00Z',
    isPomodoro: false,
    isPrivate: true,
    description: 'IELTS 7.0 목표로 스피킹 실력을 향상시켜요!',
    creator: {
      nickname: 'IELTS선생님',
    },
  },
  {
    roomId: 9,
    title: '코딩테스트 대비반',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=156&h=193&fit=crop&crop=center',
    tag: ['코딩테스트', '알고리즘', 'C++'],
    category: '취업',
    maxParticipants: 8,
    currentParticipants: 8,
    createdAt: '2025-01-10T02:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: '매일 문제 풀이로 대기업 코테 준비!',
    creator: {
      nickname: '코테왕',
    },
  },
  {
    roomId: 10,
    title: '독서 토론 모임',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=156&h=193&fit=crop&crop=center',
    tag: ['독서', '토론', '인문학'],
    category: '자율',
    maxParticipants: 6,
    currentParticipants: 3,
    createdAt: '2025-01-10T01:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: '한 달에 한 권씩 책을 읽고 토론해요!',
    creator: {
      nickname: '책벌레',
    },
  },
  {
    roomId: 11,
    title: '컴활 1급 자격증',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=156&h=193&fit=crop&crop=center',
    tag: ['컴활', '엑셀', 'Office'],
    category: '자격증',
    maxParticipants: 5,
    currentParticipants: 3,
    createdAt: '2025-01-09T23:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: '컴활 1급 실기 집중 준비반!',
    creator: {
      nickname: 'Office마스터',
    },
  },
  {
    roomId: 12,
    title: 'Python 데이터 분석',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=156&h=193&fit=crop&crop=center',
    tag: ['Python', '데이터분석', 'pandas'],
    category: '자율',
    maxParticipants: 7,
    currentParticipants: 5,
    createdAt: '2025-01-09T22:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: 'pandas와 matplotlib로 데이터 분석 마스터!',
    creator: {
      nickname: '데이터과학자',
    },
  },
  {
    roomId: 13,
    title: 'JLPT N2 준비',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=156&h=193&fit=crop&crop=center',
    tag: ['JLPT', '일본어', 'N2'],
    category: '어학',
    maxParticipants: 6,
    currentParticipants: 4,
    createdAt: '2025-01-09T21:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: 'JLPT N2 합격을 위한 체계적 학습!',
    creator: {
      nickname: '일본어선생님',
    },
  },
  {
    roomId: 14,
    title: 'SQL 개발자 자격증',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=156&h=193&fit=crop&crop=center',
    tag: ['SQL', 'SQLD', '데이터베이스'],
    category: '자격증',
    maxParticipants: 8,
    currentParticipants: 6,
    createdAt: '2025-01-09T20:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: 'SQLD 자격증 취득을 위한 체계적 학습!',
    creator: {
      nickname: 'DB전문가',
    },
  },
  {
    roomId: 15,
    title: '면접 스터디 모임',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=156&h=193&fit=crop&crop=center',
    tag: ['면접', 'IT취업', '모의면접'],
    category: '취업',
    maxParticipants: 5,
    currentParticipants: 3,
    createdAt: '2025-01-09T19:00:00Z',
    isPomodoro: false,
    isPrivate: true,
    description: '개발자 면접 준비와 모의면접 진행!',
    creator: {
      nickname: '면접왕',
    },
  },
  {
    roomId: 16,
    title: 'Node.js 백엔드 개발',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=156&h=193&fit=crop&crop=center',
    tag: ['Node.js', 'Express', '백엔드'],
    category: '자율',
    maxParticipants: 6,
    currentParticipants: 4,
    createdAt: '2025-01-09T18:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: 'Node.js와 Express로 RESTful API 개발!',
    creator: {
      nickname: 'Node개발자',
    },
  },
  {
    roomId: 17,
    title: '중국어 HSK 6급',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=156&h=193&fit=crop&crop=center',
    tag: ['중국어', 'HSK', '6급'],
    category: '어학',
    maxParticipants: 4,
    currentParticipants: 2,
    createdAt: '2025-01-09T17:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: 'HSK 6급 합격을 위한 집중 학습!',
    creator: {
      nickname: '중국어마스터',
    },
  },
  {
    roomId: 18,
    title: '정보보안기사 준비',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=156&h=193&fit=crop&crop=center',
    tag: ['정보보안기사', '보안', '네트워크'],
    category: '자격증',
    maxParticipants: 7,
    currentParticipants: 5,
    createdAt: '2025-01-09T16:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: '정보보안기사 필기와 실기 완벽 대비!',
    creator: {
      nickname: '보안전문가',
    },
  },
  {
    roomId: 19,
    title: 'Flutter 모바일 개발',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=156&h=193&fit=crop&crop=center',
    tag: ['Flutter', 'Dart', '모바일'],
    category: '자율',
    maxParticipants: 6,
    currentParticipants: 3,
    createdAt: '2025-01-09T15:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: 'Flutter로 크로스 플랫폼 앱 개발!',
    creator: {
      nickname: 'Flutter개발자',
    },
  },
  {
    roomId: 20,
    title: '기계학습 스터디',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=156&h=193&fit=crop&crop=center',
    tag: ['머신러닝', 'AI', 'TensorFlow'],
    category: '자율',
    maxParticipants: 8,
    currentParticipants: 6,
    createdAt: '2025-01-09T14:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: '기계학습 알고리즘과 실습 프로젝트!',
    creator: {
      nickname: 'AI연구자',
    },
  },
  {
    roomId: 21,
    title: '포트폴리오 리뷰',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=156&h=193&fit=crop&crop=center',
    tag: ['포트폴리오', '취업', '개발자'],
    category: '취업',
    maxParticipants: 4,
    currentParticipants: 2,
    createdAt: '2025-01-09T13:00:00Z',
    isPomodoro: false,
    isPrivate: true,
    description: '개발자 포트폴리오 상호 피드백!',
    creator: {
      nickname: '포트폴리오전문가',
    },
  },
  {
    roomId: 22,
    title: 'DevOps 실무 스터디',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=156&h=193&fit=crop&crop=center',
    tag: ['DevOps', 'Docker', 'Jenkins'],
    category: '자율',
    maxParticipants: 5,
    currentParticipants: 4,
    createdAt: '2025-01-09T12:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: 'CI/CD 파이프라인과 컨테이너 기술!',
    creator: {
      nickname: 'DevOps엔지니어',
    },
  },
  {
    roomId: 23,
    title: '영어 문법 마스터',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=156&h=193&fit=crop&crop=center',
    tag: ['영어문법', '영작문', 'Grammar'],
    category: '어학',
    maxParticipants: 6,
    currentParticipants: 4,
    createdAt: '2025-01-09T11:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: '영어 문법의 기초부터 고급까지!',
    creator: {
      nickname: '영문법선생님',
    },
  },
  {
    roomId: 24,
    title: 'AWS 클라우드 자격증',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=156&h=193&fit=crop&crop=center',
    tag: ['AWS', '클라우드', 'SAA'],
    category: '자격증',
    maxParticipants: 7,
    currentParticipants: 5,
    createdAt: '2025-01-09T10:00:00Z',
    isPomodoro: true,
    isPrivate: false,
    description: 'AWS Solutions Architect Associate 취득!',
    creator: {
      nickname: 'AWS전문가',
    },
  },
  {
    roomId: 25,
    title: '캐리어 전환 스터디',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=156&h=193&fit=crop&crop=center',
    tag: ['커리어', '개발자전환', '신입개발자'],
    category: '취업',
    maxParticipants: 6,
    currentParticipants: 3,
    createdAt: '2025-01-09T09:00:00Z',
    isPomodoro: false,
    isPrivate: false,
    description: '비전공자를 위한 개발자 전환 완전 가이드!',
    creator: {
      nickname: '커리어멘토',
    },
  },
];

export const studyRoomHandlers = [
  // 스터디룸 목록 조회 (Cursor 기반)
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms`,
    ({ request }) => {
      const url = new URL(request.url);
      const cursorId = url.searchParams.get('cursorId');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const sort = url.searchParams.get('sort') || 'latest';
      const category = url.searchParams.get('category');
      const hideFullRooms = url.searchParams.get('hideFullRooms') === 'true';

      console.log('🎯 MSW: Intercepted study-rooms request (cursor-based):', {
        cursorId,
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

      // Cursor 기반 필터링
      if (cursorId) {
        const cursorIndex = filteredRooms.findIndex(
          (room) => room.roomId.toString() === cursorId,
        );

        if (cursorIndex !== -1) {
          // cursor 다음부터 가져오기
          filteredRooms = filteredRooms.slice(cursorIndex + 1);
        }
      }

      // 제한된 개수만 반환
      const paginatedRooms = filteredRooms.slice(0, limit);
      const hasNextPage = filteredRooms.length > limit;

      const responseData = {
        data: {
          cursorId:
            paginatedRooms.length > 0
              ? paginatedRooms[paginatedRooms.length - 1].roomId.toString()
              : null,
          size: paginatedRooms.length,
          content: paginatedRooms,
          hasNextPage,
        },
      };

      console.log(
        '✅ MSW: Returning study rooms (cursor-based):',
        responseData.data,
      );

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
