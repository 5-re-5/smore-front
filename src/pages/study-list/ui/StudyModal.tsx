import type { StudyRoom } from '@/entities/study';
import { ClockIcon, LockIcon } from '@/shared/ui/icons';
import { useRouter } from '@tanstack/react-router';

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: StudyRoom;
}

export function StudyModal({ isOpen, onClose, room }: StudyModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleJoinClick = () => {
    router.navigate({
      to: '/room/$roomId/prejoin',
      params: { roomId: room.roomId.toString() },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] mx-4 shadow-lg">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="relative">
            <h2 className="text-xl font-bold text-gray-900 pr-8 mt-2">
              {room.title}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-600 text-xl leading-none absolute top-0 right-0"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {room.isPrivate ? '비공개' : '공개'} {room.currentParticipants}/
            {room.maxParticipants}명
          </p>
        </div>

        {/* 3개 아이콘 섹션 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              {/* 카테고리 아이콘 */}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {room.category}
              </span>
            </div>

            <div className="flex flex-col items-center">
              {/* 뽀모도로 아이콘 */}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm">
                <ClockIcon className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                뽀모도로 {room.isPomodoro ? 'X' : 'O'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              {/* 비밀방 아이콘 */}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm">
                <LockIcon className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                비밀번호 {room.isPrivate ? 'O' : 'X'}
              </span>
            </div>
          </div>
        </div>

        {/* 방 소개 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2">방 소개</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {room.description || `관리자가 전합니다. 항상 파이팅~~!!`}
          </p>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* 태그 입력 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">태그</h3>

          {/* 기존 태그들 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {room.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleJoinClick}
            className="cursor-pointer flex-1 py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            참가
          </button>
        </div>
      </div>
    </div>
  );
}
