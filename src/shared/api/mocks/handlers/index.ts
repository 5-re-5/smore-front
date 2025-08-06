import { userRecentStudyHandlers, userProfileHandlers } from './user';

// 환경변수로 제어할 수 있는 조건부 handlers
const shouldMockUserAPI = import.meta.env.VITE_MOCK_USER_API !== 'false';

export const handlers = [
  // User API - VITE_MOCK_USER_API 환경변수로 제어 (기본값: true)
  ...(shouldMockUserAPI ? userRecentStudyHandlers : []),
  ...(shouldMockUserAPI ? userProfileHandlers : []),

  // 다른 기능별 handlers 추가 예시:
  // ...(import.meta.env.VITE_MOCK_ROOM_API !== 'false' ? roomHandlers : []),
  // ...(import.meta.env.VITE_MOCK_STUDY_API !== 'false' ? studyHandlers : []),
];
