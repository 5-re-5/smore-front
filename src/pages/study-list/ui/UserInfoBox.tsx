import {
  useAuth,
  useRecentStudyQuery,
  type UserProfile,
} from '@/entities/user';
import { RecentStudyCard } from './RecentStudyCard';
import { UserProgressSection } from './UserProgressSection';
import { UserSettingsModal } from './UserSettingsModal';

interface UserInfoBoxProps {
  userProfile: UserProfile;
}

export const UserInfoBox = ({ userProfile }: UserInfoBoxProps) => {
  const todayMinutes = userProfile?.todayStudyMinute ?? 0;
  const goalMinutes = userProfile?.goalStudyTime ?? 0;
  const progressPercentage =
    goalMinutes > 0 ? Math.round((todayMinutes / goalMinutes) * 100) : 0;

  const { userId } = useAuth();

  const { data: recentStudyData } = useRecentStudyQuery(
    userId?.toString() || '',
  );

  return (
    <div
      className="w-full h-full max-w-[1280px] mx-auto p-20 pt-16 pb-13 rounded-[25px] space-y-10 bg-study-card-bg"
      style={{
        boxShadow: '18.14px 18.14px 45.36px #D2D2D2',
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
          <UserSettingsModal userProfile={userProfile} />
        </div>
      </div>

      <UserProgressSection
        userProfile={userProfile}
        progressPercentage={progressPercentage}
      />

      <div className="space-y-5">
        <div className="text-2xl font-semibold text-gray-700">
          최근 참가한 스터디
        </div>
        <div className="flex gap-4 justify-between">
          {recentStudyData?.rooms && recentStudyData.rooms.length > 0 ? (
            recentStudyData.rooms.slice(0, 3).map((room) => (
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
  );
};
