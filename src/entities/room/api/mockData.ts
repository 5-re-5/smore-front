import { type RoomApiResponse } from '@/entities/room';

// 임시 mock 데이터
export const mockRooms: Record<number, RoomApiResponse> = {
  123: {
    data: {
      room_id: 123,
      title: 'JavaScript 심화 스터디',
      description: '매일 2시간씩 JavaScript 개념 정리 및 코딩테스트 문제 풀이',
      thumbnail_url: 'https://picsum.photos/200/200?random=1',
      tag: 'JavaScript,코딩테스트,프론트엔드',
      category: '취업',
      focus_time: 25,
      break_time: 5,
      max_participants: 6,
      current_participants: 4,
      password: null,
      created_at: '2025-01-20T10:30:00Z',
      creator: {
        user_id: 67890,
        nickname: 'mandubol',
      },
    },
  },
  456: {
    data: {
      room_id: 456,
      title: 'React 심화 스터디',
      description: 'React 18 신기능부터 Next.js까지 깊이 있게 학습',
      thumbnail_url: 'https://picsum.photos/200/200?random=2',
      tag: 'React,Next.js,TypeScript',
      category: '개발',
      focus_time: 50,
      break_time: 10,
      max_participants: 4,
      current_participants: 2,
      password: '1234', // 비공개 방
      created_at: '2025-01-19T14:00:00Z',
      creator: {
        user_id: 12345,
        nickname: 'reactmaster',
      },
    },
  },
  789: {
    data: {
      room_id: 789,
      title: '알고리즘 스터디',
      description: '백준, 프로그래머스 문제 풀이 및 토론',
      thumbnail_url: 'https://picsum.photos/200/200?random=3',
      tag: '알고리즘,자료구조,PS',
      category: '취업',
      focus_time: null,
      break_time: null,
      max_participants: 8,
      current_participants: 6,
      password: null,
      created_at: '2025-01-18T09:15:00Z',
      creator: {
        user_id: 54321,
        nickname: 'algorithmguru',
      },
    },
  },
};
