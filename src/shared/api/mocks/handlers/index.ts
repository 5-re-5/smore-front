import { userRecentStudyHandlers, userProfileHandlers } from './user';
import { studyRoomHandlers } from './study';

// 환경변수로 제어할 수 있는 조건부 handlers
const shouldMockUserAPI = import.meta.env.VITE_MOCK_USER_API !== 'false';
const shouldMockStudyAPI = import.meta.env.VITE_MOCK_STUDY_API !== 'false';

export const handlers = [
  // User API - VITE_MOCK_USER_API 환경변수로 제어 (기본값: true)
  ...(shouldMockUserAPI ? userRecentStudyHandlers : []),
  ...(shouldMockUserAPI ? userProfileHandlers : []),

  // Study Room API - VITE_MOCK_STUDY_API 환경변수로 제어 (기본값: true)
  ...(shouldMockStudyAPI ? studyRoomHandlers : []),
];
