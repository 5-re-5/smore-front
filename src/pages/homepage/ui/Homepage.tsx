import { Link } from '@tanstack/react-router';

export default function Homepage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">홈페이지입니다 🚀</h1>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">테스트 방 목록</h2>
        <div className="space-y-2">
          <Link
            to="/room/$roomId/prejoin"
            params={{ roomId: '123' }}
            className="block p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="font-medium">JavaScript 심화 스터디</div>
            <div className="text-sm text-gray-600">
              방 ID: 123 • 공개방 • 4/6명
            </div>
            <div className="text-xs text-blue-600 mt-1">방장: mandubol</div>
          </Link>

          <Link
            to="/room/$roomId/prejoin"
            params={{ roomId: '456' }}
            className="block p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="font-medium">React 심화 스터디</div>
            <div className="text-sm text-gray-600">
              방 ID: 456 • 🔒 비공개방 • 2/4명
            </div>
            <div className="text-xs text-blue-600 mt-1">방장: reactmaster</div>
          </Link>

          <Link
            to="/room/$roomId/prejoin"
            params={{ roomId: '789' }}
            className="block p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="font-medium">알고리즘 스터디</div>
            <div className="text-sm text-gray-600">
              방 ID: 789 • 공개방 • 6/8명
            </div>
            <div className="text-xs text-blue-600 mt-1">
              방장: algorithmguru
            </div>
          </Link>

          <Link
            to="/room/$roomId/prejoin"
            params={{ roomId: '999' }}
            className="block p-4 border rounded-lg hover:bg-gray-50 opacity-50"
          >
            <div className="font-medium">존재하지 않는 방 (테스트용)</div>
            <div className="text-sm text-gray-600">
              방 ID: 999 • 에러 테스트
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
