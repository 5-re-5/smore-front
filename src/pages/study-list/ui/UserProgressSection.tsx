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
      <div className="relative w-full h-8">
        {/* 배경 바 */}
        <div
          className="w-full h-full rounded-full border border-solid"
          style={{
            background: '#EBEFF3',
            boxShadow: '7.25px 7.25px 14.5px rgba(255, 255, 255, 0.75)',
            borderRadius: '1.8125rem',
            borderColor: '#F4F7F9',
            borderWidth: '1.81px',
          }}
        />

        {/* 파란색 진행 바 */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(progressPercentage, 100)}%`,
            borderRadius: '29px',
            background: '#5585FF',
            boxShadow:
              '-14.5px -14.5px 21.75px 0 rgba(51, 88, 184, 0.25) inset, -7.25px -7.25px 14.5px 0 rgba(51, 88, 184, 0.75) inset, 14.5px 14.5px 21.75px 0 rgba(51, 88, 184, 0.25) inset, 7.25px 7.25px 14.5px 0 rgba(51, 88, 184, 0.75) inset, -14.5px -14.5px 21.75px 0 rgba(255, 255, 255, 0.25), -7.25px -7.25px 14.5px 0 rgba(255, 255, 255, 0.75), 14.5px 14.5px 21.75px 0 rgba(189, 194, 199, 0.25), 7.25px 7.25px 14.5px 0 rgba(189, 194, 199, 0.75)',
          }}
        >
          {/* 진행률 표시 원형 아이콘 */}
          {progressPercentage > 0 && (
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
              {/* 파란 원 (도넛 모양) */}
              <div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: '43.636px',
                  height: '40px',
                  background:
                    'linear-gradient(90deg, #5585FF 83.15%, rgba(85, 133, 255, 0.92) 90.88%, #5585FF 97.84%)',
                  boxShadow:
                    '-14.5px -14.5px 21.75px 0 rgba(51, 88, 184, 0.25) inset, -7.25px -7.25px 14.5px 0 rgba(51, 88, 184, 0.75) inset, 14.5px 14.5px 21.75px 0 rgba(51, 88, 184, 0.25) inset, 7.25px 7.25px 14.5px 0 rgba(51, 88, 184, 0.75) inset',
                }}
              >
                {/* 주황 원 */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: '24.242px',
                    height: '22.222px',
                    background:
                      'radial-gradient(50% 50% at 50% 50%, #FC5132 0%, #FC5132 100%)',
                    boxShadow:
                      '-14.5px -14.5px 21.75px 0 rgba(252, 81, 50, 0.25) inset, -7.25px -7.25px 14.5px 0 rgba(252, 81, 50, 0.75) inset, 14.5px 14.5px 21.75px 0 rgba(255, 255, 255, 0.25) inset, 7.25px 7.25px 14.5px 0 rgba(255, 255, 255, 0.75) inset',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 정보 섹션 */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-1 space-x-24 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              내 각오
            </div>
            <div className="text-2xl font-bold text-study-primary mb-1">
              {userProfile?.determination || '각오를 설정해보세요'}
            </div>
          </div>

          <div className="flex flex-1 pl-20 space-x-24 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              D-DAY
            </div>
            <div className="text-2xl font-bold text-study-primary">
              {userProfile?.targetDateTitle || '디데이 목표를 설정해보세요'}{' '}
              {userProfile?.targetDate
                ? calculateDDay(userProfile.targetDate)
                : ''}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
