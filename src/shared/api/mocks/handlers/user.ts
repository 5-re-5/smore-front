import { http, HttpResponse } from 'msw';

export const userRecentStudyHandlers = [
  // 최근 참가한 스터디 조회
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/users/:userId/recent-study`,
    ({ params }) => {
      const { userId } = params;

      console.log('🎯 MSW: Intercepted recent study request for user:', userId);

      const mockData = {
        data: {
          rooms: [
            {
              roomId: 1,
              title: '알고리즘 스터디',
              owner: '용용',
              category: '코딩 테스트',
              maxParticipants: 6,
              currentParticipants: 4,
              tag: ['열공', '원트합', '화이팅'],
              thumbnailUrl:
                'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=156&h=193&fit=crop&crop=center',
            },
            {
              roomId: 2,
              title: '영어 회화 연습',
              owner: '민수',
              category: '언어',
              maxParticipants: 4,
              currentParticipants: 3,
              tag: ['영어', '회화'],
              thumbnailUrl:
                'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=156&h=193&fit=crop&crop=center',
            },
            {
              roomId: 3,
              title: 'React 심화 스터디',
              owner: '지훈',
              category: '프론트엔드',
              maxParticipants: 5,
              currentParticipants: 2,
              tag: ['React', '심화', '프론트'],
              thumbnailUrl:
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=156&h=193&fit=crop&crop=center',
            },
          ],
        },
      };

      console.log(`Fetching recent studies for user: ${userId}`);

      return HttpResponse.json(mockData);
    },
  ),
];
export const userProfileHandlers = [
  // 사용자 프로필 조회
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/users/:userId`,
    ({ params }) => {
      const { userId } = params;

      console.log('🎯 MSW: Intercepted user profile request for user:', userId);

      const mockData = {
        data: {
          userId: 1,
          name: '김경훈',
          email: 'qazxc155580@gmail.com',
          nickname: '용용',
          profileUrl: 'https://example.com/profiles/1.png',
          goalStudyTime: 15,
          targetDateTitle: '금융권 취업',
          targetDate: '2026-01-02',
          determination: '열심히 해야징~',
          todayStudyMinute: 180,
          createdAt: '2025-05-01',
          level: 'OREREREO',
        },
      };

      console.log(`Fetching user profile for user: ${userId}`);

      return HttpResponse.json(mockData);
    },
  ),
];
