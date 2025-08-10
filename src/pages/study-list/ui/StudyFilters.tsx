import { RefreshIcon } from '@/shared/ui/icons';

interface StudyFiltersProps {
  sortBy: 'popular' | 'latest';
  onSortChange: (sort: 'popular' | 'latest') => void;
  hideFullRooms: boolean;
  onHideFullRoomsChange: (hide: boolean) => void;
  onCategoryClick: () => void;
  onReset: () => void;
}

export const StudyFilters = ({
  sortBy,
  onSortChange,
  hideFullRooms,
  onHideFullRoomsChange,
  onCategoryClick,
  onReset,
}: StudyFiltersProps) => {
  return (
    <div className="max-w-[1280px] mx-auto mt-[110px]">
      <h1 className="text-2xl font-bold mb-[55px]">스터디 목록</h1>

      <div className="flex justify-between items-center">
        {/* 정렬 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSortChange('popular')}
            className={`text-sm transition-colors ${sortBy === 'popular' ? 'text-black-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            인기 순
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => onSortChange('latest')}
            className={`text-sm transition-colors ${sortBy === 'latest' ? 'text-black-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            최신 순
          </button>
        </div>

        {/* 필터 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onHideFullRoomsChange(!hideFullRooms)}
            className={`text-sm transition-colors ${hideFullRooms ? 'text-black-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            바로 참여가능
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={onCategoryClick}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            카테고리
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="필터 초기화"
          >
            <RefreshIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
