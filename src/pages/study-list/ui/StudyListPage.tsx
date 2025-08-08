import { Link } from '@tanstack/react-router';
import { useUrlAuth, MOCK_STUDY_ROOMS } from '../model';
import { UserInfoBox } from './UserInfoBox';
import {
  useRecentStudyQuery,
  useUserProfileQuery,
  useAuth,
} from '@/entities/user';
import { StudyCard } from './StudyCard';
import { StudyFilters } from './StudyFilters';
import { CategoryModal } from './CategoryModal';
import { useState } from 'react';

export default function StudyListPage() {
  // URL에서 userId 파라미터 처리
  useUrlAuth();

  // 정렬/필터 상태
  const [sortBy, setSortBy] = useState<'popular' | 'latest'>('popular');
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // 인증된 사용자 ID 가져오기
  const { userId } = useAuth();

  // API로 사용자 프로필 조회
  const {
    data: userProfileData,
    isLoading: isUserProfileLoading,
    error: userProfileError,
  } = useUserProfileQuery(userId || 0);

  // API로 최근 참가한 스터디 조회
  const { data: recentStudyData } = useRecentStudyQuery(
    userId?.toString() || '',
  );

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
      {/* 내정보박스 */}
      <section className="mb-8">
        <UserInfoBox
          userProfile={userProfileData}
          recentStudyRooms={recentStudyData?.rooms}
        />
      </section>

      {/* 정렬 및 필터 글자들 */}
      <div className="mb-6">
        <StudyFilters
          sortBy={sortBy}
          onSortChange={setSortBy}
          showPrivateOnly={showPrivateOnly}
          onPrivateFilterChange={setShowPrivateOnly}
          onCategoryClick={() => setShowCategoryModal(true)}
        />
      </div>

      <section className="mt-8" aria-labelledby="available-studies">
        <h2 id="available-studies" className="text-lg font-semibold mb-4">
          참여 가능한 스터디
        </h2>
        <nav aria-label="스터디 방 목록">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-x-[50px] gap-y-[55px] list-none justify-items-center"
            role="list"
          >
            {MOCK_STUDY_ROOMS.map((room) => (
              <StudyCard key={room.roodId} room={room} />
            ))}
          </div>
        </nav>
      </section>

      {/* 카테고리 모달 */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onComplete={() => {
          setShowCategoryModal(false);
          // TODO: API 호출로 카테고리 필터 적용
        }}
      />
    </main>
  );
}
