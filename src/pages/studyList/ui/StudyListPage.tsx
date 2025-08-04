import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useUserStore, useUserInfo, useLogoutMutation } from '@/entities/user';
import { Button } from '@/shared/ui/button';

export default function StudyListPage() {
  const { setUid, setLogin, reset } = useUserStore();
  const [userId, setUserId] = useState<number | null>(null);

  const { data: userInfo } = useUserInfo(userId);
  const isLogin = userId !== null && !!userInfo;

  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        reset();
        setUserId(null);
        window.location.href = '/';
      },
      onError: (error) => {
        console.error('로그아웃 실패:', error);
      },
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('userId');

    if (!userIdParam) return;

    const parsedUserId = Number(userIdParam);
    setUserId(parsedUserId);
    setUid(parsedUserId);
    setLogin(true);
  }, [setUid, setLogin]);

  // if (userId !== null && isLoading) {
  //   return (
  //     <main className="p-8">
  //       <div className="mb-6">
  //         <h1 className="text-2xl font-bold">스터디 목록 📚</h1>
  //         <p className="text-sm text-blue-600 mt-2">🔄 사용자 정보 로딩 중...</p>
  //       </div>
  //     </main>
  //   );
  // }

  // if (userId !== null && error) {
  //   return (
  //     <main className="p-8">
  //       <div className="mb-6">
  //         <h1 className="text-2xl font-bold">스터디 목록 📚</h1>
  //         <p className="text-sm text-red-600 mt-2">❌ 사용자 정보를 불러올 수 없습니다</p>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className="p-8">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">스터디 목록 📚</h1>
            {isLogin && userInfo && (
              <div className="mt-2">
                <p className="text-sm text-green-600">✅ 로그인 완료</p>
                <p className="text-sm text-gray-700">
                  안녕하세요, {userInfo.user.nickname}님!
                </p>
              </div>
            )}
            {import.meta.env.DEV && userId !== null && (
              <p className="text-xs text-gray-400 mt-1">
                개발 모드 - 사용자 ID: {userId}
              </p>
            )}
          </div>
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            variant="outline"
            size="sm"
          >
            {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">참여 가능한 스터디</h2>
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
