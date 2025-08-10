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
import { useInfiniteStudyRoomsQuery } from '../api/useStudyRoomsQuery';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { useState, useMemo } from 'react';

export default function StudyListPage() {
  // URL에서 userId 파라미터 처리
  useUrlAuth();

  // 정렬/필터 상태
  const [sortBy, setSortBy] = useState<'popular' | 'latest'>('latest');
  const [hideFullRooms, setHideFullRooms] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // 필터 초기화 함수
  const handleReset = () => {
    setSortBy('latest');
    setHideFullRooms(false);
    setSelectedCategory(null);
  };

  // 인증된 사용자 ID 가져오기
  const { userId } = useAuth();

  // 스터디 룸 목록 API 호출 (무한 스크롤)
  const {
    data: studyRoomsData,
    isLoading: isStudyRoomsLoading,
    error: studyRoomsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStudyRoomsQuery({
    limit: 20,
    sort: sortBy,
    category: selectedCategory || undefined,
    hideFullRooms: hideFullRooms,
  });

  // 모든 페이지의 데이터를 flat하게 합치기
  const allStudyRooms = useMemo(() => {
    if (!studyRoomsData?.pages) return [];
    return studyRoomsData.pages.flatMap((page) => page.content);
  }, [studyRoomsData]);

  // 무한 스크롤을 위한 intersection observer
  const { ref: loadMoreRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });

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

  // 스터디 목록 렌더링 함수
  const renderStudyContent = () => {
    // 초기 로딩 상태
    if (isStudyRoomsLoading && allStudyRooms.length === 0) {
      return (
        <div className="col-span-full text-center py-8 text-gray-500">
          스터디 목록을 불러오는 중...
        </div>
      );
    }

    // 에러 상태
    if (studyRoomsError) {
      return (
        <div className="col-span-full text-center py-8 text-red-500">
          스터디 목록을 불러오지 못했습니다.
        </div>
      );
    }

    // 스터디 데이터가 있는 경우
    if (allStudyRooms.length > 0) {
      return allStudyRooms.map((room) => (
        <StudyCard key={room.roomId} room={room} />
      ));
    }

    // 빈 상태
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        조건에 맞는 스터디가 없습니다.
      </div>
    );
  };

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
          hideFullRooms={hideFullRooms}
          onHideFullRoomsChange={setHideFullRooms}
          onCategoryClick={() => setShowCategoryModal(true)}
          onReset={handleReset}
        />
      </div>

      <section className="mt-8" aria-labelledby="available-studies">
        {/* <h2 id="available-studies" className="text-lg font-semibold mb-4">
          참여 가능한 스터디
        </h2> */}
        <nav aria-label="스터디 방 목록">
          <div className="max-w-[1280px] mx-auto">
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-x-[40px] gap-y-[55px] list-none"
              role="list"
            >
              {renderStudyContent()}
            </div>
          </div>
        </nav>

        {/* 무한 스크롤 로딩 영역 */}
        {allStudyRooms.length > 0 && (
          <div className="max-w-[1280px] mx-auto mt-8">
            {isFetchingNextPage && (
              <div className="text-center py-8 text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                <p className="mt-2">더 많은 스터디를 불러오는 중...</p>
              </div>
            )}

            {hasNextPage && !isFetchingNextPage && (
              <div ref={loadMoreRef} className="text-center py-8 text-gray-400">
                스크롤하여 더 보기
              </div>
            )}

            {!hasNextPage && allStudyRooms.length > 0 && (
              <div className="text-center py-8 text-gray-400">
                모든 스터디를 불러왔습니다.
              </div>
            )}
          </div>
        )}
      </section>

      {/* 카테고리 모달 */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onComplete={(category) => {
          setSelectedCategory(category);
          setShowCategoryModal(false);
        }}
      />
    </main>
  );
}
