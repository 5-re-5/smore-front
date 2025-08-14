import type { RecentStudyRoom } from '@/entities/study';
import { Button } from '@/shared/ui/button';
import { ArrowIcon, UserIcon } from '@/shared/ui/icons';
import { useNavigate } from '@tanstack/react-router';

interface RecentStudyCardProps {
  room: RecentStudyRoom;
  userId: number;
}

export const RecentStudyCard = ({ room }: RecentStudyCardProps) => {
  const navigate = useNavigate();

  const handleReJoin = (roomId: number) => {
    if (!room.isDelete) {
      navigate({
        to: '/room/$roomId/prejoin',
        params: { roomId: roomId.toString() },
      });
    }
  };

  return (
    <div className="relative w-[22.19rem] h-[13.56rem] p-[0.75rem] study-card">
      {/* 블러 처리 레이어 */}
      {room.isDelete && (
        <div className=" select-none absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-md">
          <span className="text-white text-lg font-bold">종료된 방입니다</span>
        </div>
      )}
      <div
        className={`flex gap-[0.75rem] h-full select-none ${room.isDelete ? 'blur-sm' : ''}`}
      >
        {/* 썸네일 */}
        <div className="w-[9.75rem] h-[12.06rem] flex-shrink-0">
          <img
            src={room.thumbnailUrl}
            alt={`${room.title} 썸네일`}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* 스터디 정보 */}
        <div className="flex-1 flex flex-col justify-between ">
          <div className="space-y-1">
            {/* 카테고리 */}
            <div className="text-study-secondary text-sm font-medium pt-2 ">
              {room.category}
            </div>

            {/* 타이틀 */}
            <h3
              className="text-study-text text-lg font-bold leading-tight overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-all',
              }}
            >
              {room.title}
            </h3>

            {/* 방장 이름 */}
            <div className="text-study-text text-sm">{room.owner}</div>

            {/* 참가자 수 */}
            <div className="flex items-center gap-[0.25rem] text-study-text text-sm">
              <div className="">
                <UserIcon className="w-4 h-4 text-study-primary" />
              </div>
              <span>
                {room.currentParticipants}/{room.maxParticipants}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {/* 태그 */}
            <div className="flex flex-wrap gap-[0.25rem]">
              {room.tag.map((tag, index) => (
                <span
                  key={index}
                  className="text-study-secondary text-xs font-bold "
                >
                  #{tag}
                </span>
              ))}
            </div>
            {/* 재입장하기 버튼 */}
            {room.isDelete ? (
              <Button
                variant="ghost"
                disabled
                aria-disabled
                title="종료된 방입니다"
                className="w-[9.21rem] h-[2.17rem] bg-study-bg text-study-secondary font-medium
                          border-0 relative flex items-center justify-center pr-10 flex-shrink-0
                          rounded-[1.08rem] cursor-not-allowed hover:bg-study-bg"
                style={{
                  boxShadow:
                    '-4.08px -4.08px 8.17px 0 #FFF, 4.08px 4.08px 8.17px 0 rgba(0, 0, 0, 0.08)',
                }}
                onClick={(e) => e.preventDefault()} // 안전차단
              >
                종료된 방
                <div
                  className="absolute right-0 top-0 w-[2.17rem] h-[2.17rem] bg-study-bg
                            text-study-secondary flex items-center justify-center
                            rounded-[1.08rem]"
                  style={{
                    boxShadow: '4.08px 4.08px 8.17px rgba(0, 0, 0, 0.08) inset',
                  }}
                >
                  <span className="text-xs font-bold">🔒</span>
                </div>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-[9.21rem] h-[2.17rem] bg-study-bg hover:bg-gray-200 text-study-secondary font-medium border-0 relative flex items-center justify-center pr-10 flex-shrink-0 rounded-[1.08rem]"
                style={{
                  boxShadow:
                    '-4.08px -4.08px 8.17px 0 #FFF, 4.08px 4.08px 8.17px 0 rgba(0, 0, 0, 0.08)',
                }}
                onClick={() => handleReJoin(room.roomId)}
              >
                재입장하기
                <div
                  className="absolute right-0 top-0 w-[2.17rem] h-[2.17rem] bg-study-bg text-study-secondary flex items-center justify-center rounded-[1.08rem]"
                  style={{
                    boxShadow: '4.08px 4.08px 8.17px rgba(0, 0, 0, 0.08) inset',
                  }}
                >
                  <ArrowIcon />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
