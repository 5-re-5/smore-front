import { Link, useNavigate } from '@tanstack/react-router';
import { useUrlAuth } from '../model';
import { UserInfoBox } from './UserInfoBox';
import { useUserProfileQuery, useAuth } from '@/entities/user';
import StudyListContent from './StudyListContent';
import { studyListRoute } from '../route';
import { useEffect } from 'react';
import { searchDetailRoute } from '@/pages/search-detail-page/route';

export default function StudyListPage() {
  const { q } = studyListRoute.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (q) {
      navigate({ to: searchDetailRoute.to, search: { q }, replace: true });
    }
  }, [q, navigate]);

  // URL에서 userId 파라미터 처리
  useUrlAuth();

  // 인증된 사용자 ID 가져오기
  const { userId } = useAuth();

  // API로 사용자 프로필 조회
  const {
    data: userProfileData,
    isLoading: isUserProfileLoading,
    error: userProfileError,
  } = useUserProfileQuery(userId || 0);

  // 인증되지 않은 경우 처리
  if (!userId) {
    return (
      <main className="p-8 font-['Noto_Sans_KR']" role="main">
        <div className="text-center">
          <div className="text-red-500 mb-4">로그인이 필요합니다.</div>
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
            홈으로 이동
          </Link>
        </div>
      </main>
    );
  }

  if (isUserProfileLoading) {
    return (
      <main className="p-8 font-['Noto_Sans_KR']" role="main">
        <div className="text-center">사용자 정보를 불러오는 중...</div>
      </main>
    );
  }

  if (userProfileError || !userProfileData) {
    return (
      <main className="p-8 font-['Noto_Sans_KR']" role="main">
        <div className="text-red-500 text-center">
          사용자 정보를 불러오지 못했습니다.
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 font-['Noto_Sans_KR']" role="main">
      <section className="mb-8">
        <UserInfoBox userProfile={userProfileData} />
      </section>
      <div className="mt-[110px]">
        <StudyListContent />
      </div>
    </main>
  );
}
