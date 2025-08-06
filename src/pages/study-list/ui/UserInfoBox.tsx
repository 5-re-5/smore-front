import { Button } from '@/shared/ui/button';
import { calculateDDay } from '@/shared/lib/utils';
import type { UserProfile } from '@/entities/user';
import type { RecentStudyRoom } from '@/entities/study';
import { RecentStudyCard } from './RecentStudyCard';
import { SettingsIcon } from '@/shared/ui/settings-icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

interface UserInfoBoxProps {
  userProfile: UserProfile;
  recentStudyRooms?: RecentStudyRoom[];
}

export const UserInfoBox = ({
  userProfile,
  recentStudyRooms,
}: UserInfoBoxProps) => {
  const todayMinutes = userProfile?.todayStudyMinute ?? 0;
  const goalMinutes = (userProfile?.goalStudyTime ?? 0) * 60;
  const progressPercentage =
    goalMinutes > 0
      ? Math.round((todayMinutes / goalMinutes) * 100 * 100) / 100
      : 0;

  return (
    <div
      className="max-w-[1280px] mx-auto p-20 pb-10 rounded-[25px] space-y-10"
      style={{
        width: '100%',
        height: '100%',
        background: '#F3F3F3',
        boxShadow:
          '18.143999099731445px 18.143999099731445px 45.3599967956543px #D2D2D2',
        borderRadius: 25,
      }}
    >
      {/* 상단 헤더 - 오늘 공부한 시간 */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-study-text mb-2">
            오늘 공부한 시간 / 목표 시간
          </div>
          <div className="text-3xl font-bold">
            <span className="text-study-primary">
              {Math.floor(todayMinutes / 60)}시간 {todayMinutes % 60}분
            </span>
            <span className="text-study-text">
              {' '}
              / {Math.floor(goalMinutes / 60)}시간 {goalMinutes % 60}분
            </span>
          </div>
        </div>
        <div className="flex space-x-4 items-center self-start">
          <p className="text-study-muted font-medium">
            목표 시간/각오/디데이를 설정해 보세요
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <SettingsIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>설정</DialogTitle>
                <DialogDescription>
                  목표 시간, 각오, D-DAY를 설정할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4">{/* 설정 폼 내용 */}오잉</div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 text-study-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      {/* 하단 정보 섹션 */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-1 space-x-24 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              My Goal
            </div>
            <div className="text-2xl font-bold text-study-primary mb-1">
              {userProfile?.determination}
            </div>
          </div>

          <div className="flex flex-1 pl-20 space-x-24 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              D-DAY
            </div>
            <div className="text-2xl font-bold text-study-primary">
              {userProfile?.targetDateTitle}{' '}
              {userProfile?.targetDate
                ? calculateDDay(userProfile.targetDate)
                : 'D-?'}
            </div>
          </div>
        </div>

        <div className="pt-10">
          <div className="text-2xl font-semibold text-gray-700 mb-2">
            최근 참가한 스터디
          </div>
          <div className="flex gap-4 justify-between">
            {recentStudyRooms && recentStudyRooms.length > 0 ? (
              recentStudyRooms.slice(0, 3).map((room) => (
                <div key={room.roomId} className="flex-shrink-0">
                  <RecentStudyCard room={room} />
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                최근 참가한 스터디가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
