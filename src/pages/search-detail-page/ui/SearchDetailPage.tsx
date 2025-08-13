import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { searchDetailRoute } from '../route';
import StudyListContent from '@/pages/study-list/ui/StudyListContent';
import { useSearchKeyword } from '@/shared/stores/useSearchKeyword';

export default function SearchDetailPage() {
  const { q } = searchDetailRoute.useSearch();
  const navigate = useNavigate();
  const { clear } = useSearchKeyword();

  // URL q ↔ 헤더 입력 동기화
  useEffect(() => {
    // ✅ 전체 목록일 때만 입력칸을 비움
    if (q === undefined) clear();
  }, [q, clear]);

  const clearSearch = () => {
    clear(); // 검색바 비우기
    navigate({
      to: searchDetailRoute.to,
      search: {} as { q?: string },
      replace: true,
    });
  };

  return (
    <main className="px-8 pb-8 pt-0 font-['Noto_Sans_KR']" role="main">
      <div className="mt-[55px]">
        <StudyListContent
          key={q ?? 'all'}
          search={q}
          onClearSearch={clearSearch}
        >
          {q ? `“${q}” 검색 결과` : '전체 스터디'}
        </StudyListContent>
      </div>
    </main>
  );
}
