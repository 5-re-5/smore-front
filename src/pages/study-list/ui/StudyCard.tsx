import React, { useState } from 'react';
import type { StudyRoom } from '@/entities/study';
import { UserIcon, LockIcon, ClockIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui';
import { useJoinStudyMutation } from '../api/useJoinStudyMutation';

interface StudyCardProps {
  room: StudyRoom;
  onJoinClick?: (roomId: number) => void;
}

// 모달 컴포넌트
const StudyModal = ({
  isOpen,
  onClose,
  room,
  onJoin,
  isJoining,
}: {
  isOpen: boolean;
  onClose: () => void;
  room: StudyRoom;
  onJoin: (roomId: number) => void;
  isJoining: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-study-text">{room.title}</h2>
          <button
            onClick={onClose}
            className="text-study-secondary hover:text-study-text"
          >
            ✕
          </button>
        </div>

        <img
          src={room.thumbnail || '/study-thumbnail.png'}
          alt={`${room.title} 스터디 썸네일`}
          className="w-full h-40 object-cover rounded-md mb-4"
        />

        <div className="mb-4">
          <p className="text-study-secondary mb-2">카테고리: {room.category}</p>
          <p className="text-study-secondary mb-2">
            방장: {room.createrNickname}
          </p>
          <p className="text-study-secondary mb-2">
            참여자: {room.currentParticipants}/{room.maxParticipants}명
          </p>
        </div>

        <div className="flex flex-wrap gap-[0.25rem] mb-4">
          {room.tags.map((tag, index) => (
            <span key={index} className="study-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-study-bg text-study-secondary font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onJoin(room.roodId);
              onClose();
            }}
            disabled={isJoining}
            className="flex-1 py-3 px-4 bg-study-primary text-white font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isJoining ? '참가 중...' : '참가하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export function StudyCard({ room, onJoinClick }: StudyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const joinMutation = useJoinStudyMutation();

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* 메인 카드 - 세로형 레이아웃 */}
      <div className="w-[270px] h-[380px] study-card rounded-[30px] overflow-hidden flex flex-col">
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
        <div className="p-4 flex-1 flex flex-col">
          {/* 상단 콘텐츠 (제목, 참여자, 태그) */}
          <div className="space-y-[25px]">
            {/* 스터디 제목과 참여자 수 */}
            <div className="flex items-start justify-between mt-[21px]">
              <h3 className="text-study-text text-lg font-bold leading-tight flex-1 h-[48px] overflow-hidden line-clamp-2">
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
                  className="text-study-secondary text-xs py-1 font-bold"
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
          <Button
            variant="ghost"
            onClick={handleJoinClick}
            className="w-full h-[2.17rem] mt-auto bg-study-bg hover:bg-gray-200 text-study-secondary font-bold border-0 relative flex items-center justify-center rounded-[1.08rem] transition-colors"
            style={{
              boxShadow:
                '-4.08px -4.08px 8.17px 0 #FFF, 4.08px 4.08px 8.17px 0 rgba(0, 0, 0, 0.08)',
            }}
          >
            참가하기
            <div
              className="absolute right-0 top-0 w-[2.17rem] h-[2.17rem] bg-study-bg text-study-secondary flex items-center justify-center rounded-[1.08rem]"
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

      {/* 모달 */}
      <StudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
        onJoin={(roomId) => joinMutation.mutate({ roomId })}
        isJoining={joinMutation.isPending}
      />
    </>
  );
}
