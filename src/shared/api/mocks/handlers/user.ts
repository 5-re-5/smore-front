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

// 모킹된 사용자 데이터 (업데이트 가능하도록 let 사용)
// eslint-disable-next-line prefer-const
let mockUserData = {
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
};

export const userProfileHandlers = [
  // 사용자 프로필 조회
  http.get(
    `${import.meta.env.VITE_BACK_URL}/api/v1/users/:userId`,
    ({ params }) => {
      const { userId } = params;

      console.log('🎯 MSW: Intercepted user profile request for user:', userId);

      const responseData = {
        data: { ...mockUserData },
      };

      console.log(`Fetching user profile for user: ${userId}`);

      return HttpResponse.json(responseData);
    },
  ),
  // 사용자 프로필 업데이트
  http.patch(
    `${import.meta.env.VITE_BACK_URL}/api/v1/users/:userId`,
    async ({ params, request }) => {
      const { userId } = params;

      console.log('🎯 MSW: Intercepted user profile update for user:', userId);

      try {
        const formData = await request.formData();

        // FormData에서 설정 관련 필드만 추출 (카멜케이스)
        const targetDateTitle = formData.get('targetDateTitle');
        const targetDate = formData.get('targetDate');
        const goalStudyTime = formData.get('goalStudyTime');
        const determination = formData.get('determination');

        console.log('📝 Update settings data:', {
          targetDateTitle,
          targetDate,
          goalStudyTime,
          determination,
        });

        // 모킹된 사용자 데이터 업데이트 (설정 관련 필드만)
        if (targetDateTitle !== null) {
          mockUserData.targetDateTitle = targetDateTitle as string;
        }
        if (targetDate !== null) {
          mockUserData.targetDate = targetDate as string;
        }
        if (goalStudyTime !== null) {
          mockUserData.goalStudyTime = parseFloat(goalStudyTime as string);
        }
        if (determination !== null) {
          mockUserData.determination = determination as string;
        }

        const responseData = {
          data: { ...mockUserData },
          message: '설정이 성공적으로 업데이트되었습니다.',
        };

        console.log('✅ Settings updated successfully:', responseData.data);

        return HttpResponse.json(responseData, { status: 200 });
      } catch (error) {
        console.error('❌ Error processing form data:', error);

        return HttpResponse.json(
          {
            error: '설정 업데이트 중 오류가 발생했습니다.',
            message: 'Internal server error',
          },
          { status: 500 },
        );
      }
    },
  ),
];
