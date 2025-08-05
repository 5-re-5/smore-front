import { Link } from '@tanstack/react-router';
import { useUrlAuth, MOCK_STUDY_ROOMS } from '../model';

export default function StudyListPage() {
  // URL에서 userId 파라미터 처리
  useUrlAuth();

  return (
    <main className="p-8" role="main">
      <header className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">스터디 목록 📚</h1>
          </div>
        </div>
      </header>

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
