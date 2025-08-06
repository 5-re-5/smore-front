import type { UserProfile } from '@/entities/user';
import { calculateDDay } from '@/shared/lib/utils';

interface UserProgressSectionProps {
  userProfile: UserProfile;
  progressPercentage: number;
}

export const UserProgressSection = ({
  userProfile,
  progressPercentage,
}: UserProgressSectionProps) => {
  return (
    <>
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
      </div>
    </>
  );
};
