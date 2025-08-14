//정렬/필터/목록/무한스크롤 전부 포함(유저 정보 X)
// src/pages/study-list/ui/StudyListContent.tsx (예시 경로)
import { useState, useMemo } from 'react';
import { StudyCard } from './StudyCard';
import { StudyFilters } from './StudyFilters';
import { CategoryModal } from './CategoryModal';
import { useInfiniteStudyRoomsQuery } from '../api/useStudyRoomsQuery';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
type StudyListContentProps = {
  search?: string;
  /** 제목을 숨기고 싶으면 false */
  showHeading?: boolean;
  /** children이 없을 때 쓸 기본 제목 */
  defaultHeading?: React.ReactNode;
  children?: React.ReactNode; // 제목 슬롯
  onClearSearch?: () => void;
};
export default function StudyListContent({
  search,
  showHeading = true,
  defaultHeading = '스터디 목록',
  children,
  onClearSearch,
}: StudyListContentProps) {
  const [sortBy, setSortBy] = useState<'popular' | 'latest'>('latest');
  const [hideFullRooms, setHideFullRooms] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleReset = () => {
    setSortBy('latest');
    setHideFullRooms(false);
    setSelectedCategory(null);
    onClearSearch?.(); // ★ URL의 q 제거 → 전체 목록
  };

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
    hideFullRooms,
    search,
  });

  const allStudyRooms = useMemo(() => {
    if (!studyRoomsData?.pages) return [];
    return studyRoomsData.pages.flatMap((page) => page.content);
  }, [studyRoomsData]);

  const { ref: loadMoreRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const renderStudyContent = () => {
    if (isStudyRoomsLoading && allStudyRooms.length === 0) {
      return (
        <div className="col-span-full text-center py-8 text-gray-500">
          스터디 목록을 불러오는 중...
        </div>
      );
    }
    if (studyRoomsError) {
      return (
        <div className="col-span-full text-center py-8 text-red-500">
          스터디 목록을 불러오지 못했습니다.
        </div>
      );
    }
    if (allStudyRooms.length > 0) {
      return allStudyRooms.map((room) => (
        <StudyCard key={room.roomId} room={room} />
      ));
    }
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        조건에 맞는 스터디가 없습니다.
      </div>
    );
  };
  const headingNode = showHeading ? (children ?? defaultHeading) : undefined;
  return (
    <>
      <div className="mb-6">
        <StudyFilters
          sortBy={sortBy}
          onSortChange={setSortBy}
          hideFullRooms={hideFullRooms}
          onHideFullRoomsChange={setHideFullRooms}
          onCategoryClick={() => setShowCategoryModal(true)}
          onReset={handleReset}
          title={headingNode}
        />
      </div>

      <section className="mt-8" aria-labelledby="available-studies">
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
            {/* 디버깅용 문가같다는 피드백으로 우선 주석처리 */}
            {/* {!hasNextPage && allStudyRooms.length > 0 && (
              <div className="text-center py-8 text-gray-400">
                모든 스터디를 불러왔습니다.
              </div>
            )} */}
          </div>
        )}
      </section>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        onComplete={(category) => {
          setSelectedCategory(category);
          setShowCategoryModal(false);
        }}
      />
    </>
  );
}
