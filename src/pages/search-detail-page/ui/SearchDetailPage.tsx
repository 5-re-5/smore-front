import { searchDetailRoute } from '../route';
import StudyListContent from '@/pages/study-list/ui/StudyListContent';

function SearchDetailPage() {
  // URL 쿼리에서 q 읽어오기
  const { q } = searchDetailRoute.useSearch();

  return (
    <>
      {/* 검색 결과 - 총 00개 스터디 */}
      <div>
        <main
          className="mt-[55px] px-8 pb-8 pt-0 font-['Noto_Sans_KR']"
          role="main"
        >
          <StudyListContent> "{q}" 검색 결과 </StudyListContent>
        </main>
      </div>
    </>
  );
}

export default SearchDetailPage;
