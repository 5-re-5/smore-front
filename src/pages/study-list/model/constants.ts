// Study room constants
export const MOCK_STUDY_ROOMS = [
  {
    id: '3',
    title: 'JavaScript 심화 스터디',
    isPrivate: false,
    currentParticipants: 4,
    maxParticipants: 6,
    owner: 'mandubol',
    isError: false,
  },
  {
    id: '2',
    title: 'React 심화 스터디',
    isPrivate: true,
    currentParticipants: 2,
    maxParticipants: 4,
    owner: 'reactmaster',
    isError: false,
  },
  {
    id: '1',
    title: '알고리즘 스터디',
    isPrivate: false,
    currentParticipants: 6,
    maxParticipants: 8,
    owner: 'algorithmguru',
    isError: false,
  },
  {
    id: '999',
    title: '존재하지 않는 방 (테스트용)',
    isPrivate: false,
    currentParticipants: 0,
    maxParticipants: 0,
    owner: '',
    isError: true,
  },
] as const;
