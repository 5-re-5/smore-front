import { useNavigate } from '@tanstack/react-router';
import { searchDetailRoute } from '../route';
import StudyListContent from '@/pages/study-list/ui/StudyListContent';

function SearchDetailPage() {
  // URL 쿼리에서 q 읽어오기
  const { q } = searchDetailRoute.useSearch();
  const navigate = useNavigate();
  const clearSearch = () =>
    navigate({
      to: searchDetailRoute.to,
      search: (prev) => ({ ...prev, q: undefined }), // q 제거
    });

  return (
    <main
      className="mt-[55px] px-8 pb-8 pt-0 font-['Noto_Sans_KR']"
      role="main"
    >
      {/* key={q} 로 q 변경 시 컴포넌트 리셋 → useInfiniteQuery도 새로 실행 */}
      <StudyListContent search={q} key={q} onClearSearch={clearSearch}>
        {' '}
        "{q}" 검색 결과{' '}
      </StudyListContent>
    </main>
  );
}

export default SearchDetailPage;
