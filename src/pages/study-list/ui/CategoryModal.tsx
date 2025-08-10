import { useState, useEffect } from 'react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onComplete: (category: string | null) => void;
}

const categories = [
  { id: 'job', name: '취업', icon: '💼' },
  { id: 'certification', name: '자격증', icon: '📜' },
  { id: 'language', name: '어학', icon: '🌐' },
  { id: 'self-study', name: '자율', icon: '📚' },
  { id: 'meeting', name: '회의', icon: '👥' },
  { id: 'school', name: '학교공부', icon: '🏫' },
];

export const CategoryModal = ({
  isOpen,
  onClose,
  selectedCategory,
  onComplete,
}: CategoryModalProps) => {
  const [tempCategory, setTempCategory] = useState<string | null>(
    selectedCategory,
  );

  // 모달이 열릴 때마다 현재 선택된 카테고리로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempCategory(selectedCategory);
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 mx-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">카테고리</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() =>
                setTempCategory(
                  tempCategory === category.name ? null : category.name,
                )
              }
              className={`cursor-pointer aspect-square p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all border-2 ${
                tempCategory === category.name
                  ? 'bg-gray-100 shadow-inner transform scale-95'
                  : 'bg-gray-100 hover:bg-gray-200 border-transparent shadow-md hover:shadow-lg'
              }`}
            >
              <div className="text-2xl">{category.icon}</div>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={() => onComplete(tempCategory)}
          className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          완료
        </button>
      </div>
    </div>
  );
};
