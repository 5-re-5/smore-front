import React, { useState } from 'react';
import type { StudyRoom } from '@/entities/study';
import { UserIcon, LockIcon, ClockIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui';
import { StudyModal } from './StudyModal';

interface StudyCardProps {
  room: StudyRoom;
  onJoinClick?: (roomId: number) => void;
}

export function StudyCard({ room }: StudyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* 메인 카드 - 세로형 레이아웃 */}
      <div className="w-[270px] h-[360px] study-card rounded-[30px] overflow-hidden flex flex-col ">
        {/* 썸네일 섹션 */}
        <div className="relative mt-[11px] mx-[10px]">
          <img
            src={room.thumbnail || '/study-thumbnail.png'}
            alt={`${room.title} 썸네일`}
            className="w-full h-[160px] object-cover rounded-[20px]"
          />

          {/* 뽀모도로 표시 */}
          {room.isPomodoro && (
            <div
              className="absolute top-3 left-3 w-8 h-8 bg-study-bg text-study-text rounded-full flex items-center justify-center"
              style={{ boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)' }}
            >
              <ClockIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* 정보 섹션 */}
        <div className="p-4 pt-[21px] flex-1 flex flex-col">
          {/* 상단 콘텐츠 (제목, 참여자, 태그) */}
          <div className="space-y-[20px] mb-[27px]">
            {/* 스터디 제목과 참여자 수 */}
            <div className="flex items-start justify-between">
              <h3 className="text-study-text text-lg font-bold leading-tight flex-1 h-[43px] overflow-hidden line-clamp-2">
                {room.title}
              </h3>
              <div className="flex items-center gap-1 text-study-text text-sm ml-2">
                <UserIcon className="w-4 h-4 text-study-primary" />
                <span>
                  {room.currentParticipants}/{room.maxParticipants}
                </span>
              </div>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {room.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-study-secondary text-xs font-bold"
                >
                  #{tag}
                </span>
              ))}
              {room.tags.length > 3 && (
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 font-medium">
                  +{room.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* 참가하기 버튼 */}
          <div className="flex justify-center mb-3">
            <Button
              variant="ghost"
              onClick={handleJoinClick}
              className="w-[183.68px] h-[47px] bg-study-bg hover:bg-gray-200 text-study-secondary font-bold border-0 relative flex items-center justify-center rounded-[23.5px] transition-colors"
              style={{
                boxShadow:
                  '-4.08px -4.08px 8.17px 0 #FFF, 4.08px 4.08px 8.17px 0 rgba(0, 0, 0, 0.08)',
              }}
            >
              참가하기
              <div
                className="absolute right-0 top-0 w-[47px] h-[47px] bg-study-bg text-study-secondary flex items-center justify-center rounded-full"
                style={{
                  boxShadow: '4.08px 4.08px 8.17px rgba(0, 0, 0, 0.08) inset',
                }}
              >
                {room.isPrivate ? (
                  <LockIcon className="w-4 h-5 text-black" />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8.5 3.5L14 8l-5.5 4.5v-3H2v-3h7.5V3.5z" />
                  </svg>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <StudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
      />
    </>
  );
}
