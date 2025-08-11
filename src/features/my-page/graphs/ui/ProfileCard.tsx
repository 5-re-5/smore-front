import type { FunctionComponent } from 'react';
import { useProfileCard } from '../model/useProfileCard';
import { useAttendanceStatistics } from '../model/useAttendanceStatistics';
import { useNavigate } from '@tanstack/react-router';

type Props = { userId: string };

const ProfileCard: FunctionComponent<Props> = ({ userId }) => {
  const { profile } = useProfileCard(userId); // ✅ profileLoading 제거
  const { attendance } = useAttendanceStatistics(userId); // ✅ attendLoading 제거
  const navigate = useNavigate();

  const DEFAULT_IMAGE = '/images/profile_apple.jpg';
  const DEFAULT_LEVEL = 'orerereo'; // API 실패 시 등급 fallback

  const safeProfile = profile || {
    profile_url: '',
    nickname: '닉네임',
    target_date_title: '목표 없음',
    level: DEFAULT_LEVEL,
  };
  const safeAttendance = attendance ?? 0;

  const imgSrc =
    safeProfile.profile_url && safeProfile.profile_url.trim()
      ? safeProfile.profile_url
      : DEFAULT_IMAGE;

  const levelName =
    safeProfile.level && safeProfile.level.trim()
      ? safeProfile.level
      : DEFAULT_LEVEL;

  return (
    <div className="w-[1200px] h-[700px] bg-aliceblue shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] relative text-left text-[1.5rem] text-dimgray font-montserrat mx-auto flex flex-col justify-start items-center">
      {/* 상단 */}
      <div className="w-full flex flex-row items-start justify-between pt-16 pr-8">
        {/* 프로필 이미지 + 톱니바퀴 */}
        <div className="relative">
          <img
            className="w-[180px] h-[180px] rounded-[45px] object-cover ml-[56px]"
            alt="프로필"
            src={imgSrc}
          />
          <button
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-50 transition"
            onClick={() => navigate({ to: '/edit-page' })}
            title="프로필 수정"
            type="button"
          >
            <img
              src="/images/settings_icon.svg"
              alt="설정"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* 중앙 텍스트 */}
        <div className="flex flex-col justify-center items-start min-w-[220px] relative h-[180px] ml-8">
          <b className="mb-3 block tracking-[0.01em] leading-[133.4%] h-[36px]">
            연속 {safeAttendance}일 출석!
          </b>
          <b className="text-[2rem] text-darkslategray block mb-3 tracking-[0.01em] leading-[133.4%] h-[32px]">
            {safeProfile.nickname}
          </b>
          <b className="block tracking-[0.01em] leading-[133.4%] text-lightseagreen h-[34px]">
            목표: {safeProfile.target_date_title}
          </b>
        </div>

        {/* 우측 카드: 등급 */}
        <div className="relative w-[450px] h-[190px] flex-shrink-0 flex flex-col items-center rounded-[43px] bg-aliceblue shadow-[-8px_-8px_16px_#fff_inset,8px_8px_16px_#d0d3d7_inset] mr-[56px]">
          <div
            className="absolute top-[-23px] left-1/2 transform -translate-x-1/2 shadow-lg bg-white rounded-full px-10 py-4 flex items-center border border-b-2 border-zinc-200"
            style={{
              minWidth: '180px',
              boxShadow: '0 6px 20px 0 rgba(110, 130, 203, 0.12)',
              fontWeight: 800,
              fontSize: '1.35rem',
              letterSpacing: '0.03em',
            }}
          >
            {levelName}
          </div>
        </div>
      </div>

      {/* 하단 박스 */}
      <div className="absolute left-[56px] top-[350px] w-[1087px] h-[286px] flex flex-row items-start justify-start pt-[22px] pb-[24px] pl-[22px] pr-[24px] box-border">
        <div className="w-full h-full absolute top-0 left-0 z-[0]">
          <div className="absolute h-full w-full top-0 left-0 shadow-[-1px_-1px_0px_#fff_inset,_-2px_-2px_2px_#b8cce0_inset,_-1px_-1px_0px_#fff,_-2px_-2px_2px_#b8cce0] rounded-[32px] bg-aliceblue" />
        </div>
      </div>

      {/* 하단 고정 텍스트 */}
      <div className="absolute top-[300px] left-[56px] font-semibold text-darkslategray">
        마시멜로 굽기
      </div>
      <div className="absolute top-[318px] left-[1018px] text-[0.875rem] font-medium text-gray">
        최근 1년간 공부 기록
      </div>
    </div>
  );
};

export default ProfileCard;
