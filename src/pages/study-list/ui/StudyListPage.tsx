import { Link } from '@tanstack/react-router';
import { useUrlAuth, MOCK_STUDY_ROOMS } from '../model';
import { RecentStudyCard } from './RecentStudyCard';

export default function StudyListPage() {
  // URL에서 userId 파라미터 처리
  useUrlAuth();

  // 임시 데이터 - 나중에 API로 교체
  const mockRecentStudies = [
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
  ];

  return (
    <main className="p-8 font-['Noto_Sans_KR']" role="main">
      <header className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">스터디 목록 📚</h1>
          </div>
        </div>
      </header>

      {/* 최근 참가한 스터디 섹션 */}
      <section className="mb-8" aria-labelledby="recent-studies">
        <h2
          id="recent-studies"
          className="text-[1.50rem] font-bold leading-[2.00rem] tracking-[0.08rem] text-study-text mb-4"
          style={{
            fontSize: '1.50rem',
            fontWeight: '700',
            lineHeight: '2.00rem',
            letterSpacing: '0.08rem',
            fontFamily: 'Noto Sans KR',
          }}
        >
          최근 참가한 스터디
        </h2>
        <div className="flex gap-4 flex-wrap">
          {mockRecentStudies.map((room) => (
            <RecentStudyCard key={room.roomId} room={room} />
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="available-studies">
        <h2 id="available-studies" className="text-lg font-semibold mb-4">
          참여 가능한 스터디
        </h2>
        <nav aria-label="스터디 방 목록">
          <ul className="space-y-2" role="list">
            {MOCK_STUDY_ROOMS.map((room) => (
              <li key={room.id}>
                <Link
                  to="/room/$roomId/prejoin"
                  params={{ roomId: room.id }}
                  className={`block p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    room.isError ? 'opacity-50' : ''
                  }`}
                  aria-label={`${room.title} 스터디 방에 참여하기`}
                >
                  <div className="font-medium">{room.title}</div>
                  <div className="text-sm text-gray-600">
                    방 ID: {room.id} •{' '}
                    {room.isPrivate ? '🔒 비공개방' : '공개방'}
                    {!room.isError && (
                      <span>
                        {' '}
                        • {room.currentParticipants}/{room.maxParticipants}명
                      </span>
                    )}
                    {room.isError && <span> • 에러 테스트</span>}
                  </div>
                  {room.owner && (
                    <div className="text-xs text-blue-600 mt-1">
                      방장: {room.owner}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}
