// MSW study.ts에서 가져온 스터디룸 목 데이터
export const mockStudyRooms = [
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
  // 추가 데이터 (roomId 7-25)
  ...Array.from({ length: 19 }, (_, i) => ({
    roomId: i + 7,
    title: `${['알고리즘', '영어', 'React', 'Java', 'Python', 'Vue', 'AWS', 'DevOps', 'AI'][i % 9]} 스터디 ${i + 7}`,
    thumbnailUrl: `https://picsum.photos/156/193?random=${i + 7}`,
    tag: [
      ['알고리즘', '코딩', '문제해결'],
      ['영어', '회화', '토익'],
      ['React', 'JavaScript', '프론트엔드'],
      ['Java', 'Spring', '백엔드'],
    ][i % 4],
    category: ['취업', '어학', '자율', '자격증'][i % 4],
    maxParticipants: [4, 5, 6, 8][i % 4],
    currentParticipants: Math.floor(Math.random() * 6),
    createdAt: `2025-01-${String(9 - Math.floor(i / 2)).padStart(2, '0')}T${String(20 - i).padStart(2, '0')}:00:00Z`,
    isPomodoro: i % 2 === 0,
    isPrivate: i % 5 === 0,
    description: `${['알고리즘', '영어', 'React', 'Java', 'Python'][i % 5]} 학습을 위한 스터디입니다.`,
    creator: {
      nickname: `${['코더', '개발자', '마스터', '전문가', '구루'][i % 5]}${i + 7}`,
    },
  })),
];
