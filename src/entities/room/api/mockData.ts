import { type RoomApiResponse } from '@/entities/room';

// 임시 mock 데이터
export const mockRooms: Record<number, RoomApiResponse> = {
  123: {
    data: {
      roomId: 123,
      title: 'JavaScript 심화 스터디',
      description: '매일 2시간씩 JavaScript 개념 정리 및 코딩테스트 문제 풀이',
      thumbnailUrl: 'https://picsum.photos/200/200?random=1',
      tag: 'JavaScript,코딩테스트,프론트엔드',
      category: '취업',
      focusTime: 25,
      breakTime: 5,
      maxParticipants: 6,
      currentParticipants: 4,
      password: null,
      createdAt: '2025-01-20T10:30:00Z',
      creator: {
        userId: 67890,
        nickname: 'mandubol',
      },
    },
  },
  456: {
    data: {
      roomId: 456,
      title: 'React 심화 스터디',
      description: 'React 18 신기능부터 Next.js까지 깊이 있게 학습',
      thumbnailUrl: 'https://picsum.photos/200/200?random=2',
      tag: 'React,Next.js,TypeScript',
      category: '개발',
      focusTime: 50,
      breakTime: 10,
      maxParticipants: 4,
      currentParticipants: 2,
      password: '1234', // 비공개 방
      createdAt: '2025-01-19T14:00:00Z',
      creator: {
        userId: 12345,
        nickname: 'reactmaster',
      },
    },
  },
  789: {
    data: {
      roomId: 789,
      title: '알고리즘 스터디',
      description: '백준, 프로그래머스 문제 풀이 및 토론',
      thumbnailUrl: 'https://picsum.photos/200/200?random=3',
      tag: '알고리즘,자료구조,PS',
      category: '취업',
      focusTime: null,
      breakTime: null,
      maxParticipants: 8,
      currentParticipants: 6,
      password: null,
      createdAt: '2025-01-18T09:15:00Z',
      creator: {
        userId: 54321,
        nickname: 'algorithmguru',
      },
    },
  },
};
