import { useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';
import MarshmallowHeatmap from './MarshmallowHeatmap';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { request } from '@/shared/api/request';

const DEFAULT_PROFILE_IMG = '/images/profile_apple.jpg';

// 스낵 타입 정의
type SnackType = 'O' | 'RE';

interface ProfileCardProps {
  userId: string;
}

// 경험치 퍼센트 계산 함수
const getExpPercentage = (current: number) => {
  return Math.min((current / 100) * 100, 100);
};

/**
 * grade 문자열을 스캔해서 ["O","RE",...] 형태로 파싱하고,
 * 최대 limit 개수까지만 반환
 */
function parseSnackTypes(grade: string): SnackType[] {
  const types: SnackType[] = [];
  let i = 0;
  while (i < grade.length) {
    if (grade.startsWith('RE', i)) {
      types.push('RE');
      i += 2;
    } else {
      // 그 외 한 글자는 O 로 처리
      types.push('O');
      i += 1;
    }
  }
  return types;
}

const getSnackIcons = (grade: string = '') => {
  const types = parseSnackTypes(grade);
  return types.map((type, idx) => {
    const src = type === 'O' ? '/images/OREO_O.webp' : '/images/OREO_RE.webp';
    console.log(src);
    // z-index: 뒤쪽일수록 위로
    const zIndex = types.length + idx;
    return (
      <img
        key={idx}
        src={src}
        alt={`${type} 과자`}
        draggable={false}
        className="mt-[20px] h-[130px] w-auto filter drop-shadow-[0_2px_5px_rgba(80,80,80,0.11)] transition-transform duration-200 hover:scale-[1.18] relative"
        style={{ zIndex }}
      />
    );
  });
};

// 프로필 이미지 컴포넌트
const ProfileImage: FunctionComponent<{ src?: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_PROFILE_IMG);
  return (
    <img
      className="w-[180px] h-[180px]
      object-cover rounded-[20px] 
      lg:rounded-[32px] 
      border-2 border-[#e6edf7] 
      bg-white shadow-[0_4px_16px_rgba(229,244,255,0.17)]"
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(DEFAULT_PROFILE_IMG)}
      draggable={false}
    />
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({ userId }) => {
  const handleEditProfile = () => {
    window.location.href = '/profile-edit';
  };

  const { data: userInfo } = useUserInfo();
  const [point, setPoint] = useState(0);

  // 포인트 가져오기
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await request<{ totalPoints: number }>({
          method: 'get',
          url: `/api/v1/points/${userId}`,
        });
        setPoint(res.data.totalPoints);
      } catch (err) {
        console.error('포인트 조회 실패:', err);
      }
    };

    if (userId) {
      fetchPoints();
    }
  }, [userId]);

  const dummyUser = {
    name: userInfo?.nickname,
    streak: 25,
    goal: userInfo?.targetDateTitle,
    grade: userInfo?.level,
    profileImg: userInfo?.profileUrl || ' ',
  };

  // ── 포인트 100 초과 시 색상 전환 ───────────────────────────────
  const isOver100 = point >= 100;

  const fillCls = isOver100
    ? 'bg-gradient-to-t from-[#22C55E] to-[#16A34A] shadow-[1px_1px_4px_rgba(22,163,74,0.4)]'
    : 'bg-gradient-to-t from-[#357ABD] to-[#4A90E2] shadow-[1px_1px_4px_rgba(74,144,226,0.4)]';

  const highlightCls = isOver100
    ? 'bg-gradient-to-t from-[#86EFAC] to-[#22C55E]'
    : 'bg-gradient-to-t from-[#6BA6F0] to-[#4A90E2]';
  // ──────────────────────────────────────────────────────────────

  return (
    <div
      className="
        w-full max-w-[100vw] lg:max-w-[1200px]
        max-h-[700px] bg-[#EBF3FF] rounded-[25px]
        shadow-[-10px_-10px_20px_#FFF,10px_10px_20px_rgba(0,0,0,0.09)]
        flex flex-col
        py-[65px] px-[56px]
        gap-[16px] lg:gap-[38px]
        relative
      "
    >
      {/* 상단 정보 영역 */}
      <div className="w-full flex justify-between items-center h-[192px]">
        {/* 프로필 + 수정 버튼 */}
        <div className="flex w-[590px]">
          <div className="relative w-[180px] h-[180px] flex flex-col items-center">
            <ProfileImage src={dummyUser.profileImg} alt="프로필 이미지" />
            <button
              onClick={handleEditProfile}
              title="프로필 수정"
              className="cursor-pointer w-[50px] h-[50px] absolute right-[-10px] bottom-[-10px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
              >
                <g filter="url(#filter0_ii_782_5427)">
                  <rect width="50" height="50" rx="25" fill="#F9F9F9" />
                </g>
                <path
                  d="M41.1114 16.9838L40.2255 15.4847C39.5555 14.351 39.2205 13.7842 38.6505 13.5581C38.0805 13.3321 37.4358 13.5104 36.1465 13.8672L33.9563 14.4686C33.1332 14.6537 32.2696 14.5487 31.518 14.1722L30.9133 13.8321C30.2688 13.4296 29.7731 12.8362 29.4987 12.1386L28.8993 10.3932C28.5052 9.23817 28.3081 8.66065 27.839 8.33033C27.3699 8 26.7467 8 25.5004 8H23.4996C22.2533 8 21.6301 8 21.161 8.33033C20.6919 8.66065 20.4948 9.23817 20.1007 10.3932L19.5013 12.1386C19.2269 12.8362 18.7312 13.4296 18.0867 13.8321L17.482 14.1722C16.7304 14.5487 15.8668 14.6537 15.0437 14.4686L12.8535 13.8672C11.5642 13.5104 10.9195 13.3321 10.3495 13.5581C9.77952 13.7842 9.44451 14.351 8.7745 15.4847L7.88858 16.9838C7.26054 18.0465 6.94652 18.5778 7.00746 19.1434C7.06841 19.7091 7.48879 20.1649 8.32957 21.0765L10.1802 23.0938C10.6325 23.6521 10.9536 24.625 10.9536 25.4997C10.9536 26.375 10.6326 27.3477 10.1802 27.906L8.32957 29.9233C7.4888 30.835 7.06841 31.2908 7.00747 31.8564C6.94652 32.4221 7.26055 32.9534 7.88858 34.0161L8.77448 35.5151C9.44448 36.6488 9.77952 37.2157 10.3495 37.4417C10.9195 37.6678 11.5642 37.4894 12.8535 37.1326L15.0436 36.5311C15.8669 36.346 16.7306 36.4511 17.4823 36.8277L18.0869 37.1679C18.7313 37.5704 19.2269 38.1638 19.5013 38.8612L20.1007 40.6068C20.4948 41.7618 20.6919 42.3393 21.161 42.6697C21.6301 43 22.2533 43 23.4996 43H25.5004C26.7467 43 27.3699 43 27.839 42.6697C28.3081 42.3393 28.5052 41.7618 28.8993 40.6068L29.4988 38.8612C29.7731 38.1638 30.2687 37.5704 30.9131 37.1679L31.5177 36.8277C32.2694 36.4511 33.1331 36.346 33.9564 36.5311L36.1465 37.1326C37.4358 37.4894 38.0805 37.6678 38.6505 37.4417C39.2205 37.2157 39.5555 36.6488 40.2255 35.5151L41.1114 34.0161C41.7395 32.9534 42.0535 32.4221 41.9925 31.8564C41.9316 31.2908 41.5112 30.835 40.6704 29.9233L38.8198 27.906C38.3674 27.3477 38.0464 26.375 38.0464 25.4997C38.0464 24.625 38.3676 23.6521 38.8199 23.0938L40.6704 21.0765C41.5112 20.1649 41.9316 19.7091 41.9925 19.1434C42.0535 18.5778 41.7395 18.0465 41.1114 16.9838Z"
                  stroke="#C4C4C4"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path
                  d="M30.7047 25.4844C30.7047 28.8671 27.8921 31.6094 24.4227 31.6094C20.9532 31.6094 18.1406 28.8671 18.1406 25.4844C18.1406 22.1016 20.9532 19.3594 24.4227 19.3594C27.8921 19.3594 30.7047 22.1016 30.7047 25.4844Z"
                  stroke="#C4C4C4"
                  stroke-width="3"
                />
                <defs>
                  <filter
                    id="filter0_ii_782_5427"
                    x="-5.4432"
                    y="-5.4432"
                    width="60.8864"
                    height="60.8864"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="5.4432" dy="5.4432" />
                    <feGaussianBlur stdDeviation="5.4432" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_782_5427"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="-5.4432" dy="-5.4432" />
                    <feGaussianBlur stdDeviation="5.4432" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_innerShadow_782_5427"
                      result="effect2_innerShadow_782_5427"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
          </div>

          {/* 사용자 정보 */}
          <div
            className="ml-[30px] grid w-[397px] h-[192px]
                          py-[25px] px-[10px]
                          gap-y-[21px] gap-x-[21px]
                          grid-rows-3 grid-cols-1"
          >
            <div
              className="
                          text-[#616161]          
                          [font-family:Montserrat]
                          text-[24px]
                          font-bold
                          leading-[133.4%]
                          tracking-[0.12px]
                          not-italic
            "
            >
              {`연속 ${dummyUser.streak}일 출석!`}
            </div>
            <div className="text-[32px] font-bold text-[#154559]">
              {dummyUser.name}
            </div>
            <div className="text-[24px] font-bold text-[#19C4B2]">
              {dummyUser.goal}
            </div>
          </div>
        </div>

        {/* 등급 네오모피즘 카드 */}
        <div
          className="
            relative
            flex flex-col gap-[12px] items-center justify-center
            w-[450px] h-[190px]
            bg-[#EBF3FF] rounded-[18px]
            shadow-[5px_5px_15px_#DBE4F0,-5px_-5px_15px_#FFF,inset_2.5px_2.5px_6px_#D9E4EE,inset_-3px_-3px_8px_#FFF]
            border-[1.5px] border-[#E2E7FA]
            p-[9px] lg:p-[13px_18px]
            mr-[6px] relative
          "
        >
          {/* 오레오 등급 이름 */}
          <div
            className="
              w-[250px] h-[45px]
              [grid-row:0/span_1] [grid-column:0/span_1]
              bg-[#EBF3FF] rounded-[141px] z-[99999]
              filter
              drop-shadow-[4px_4px_15px_#B4C1D5]
              drop-shadow-[-4px_-4px_15px_#FFFFFF]
              absolute 
              flex items-center justify-center
              top-[-20px]
              text-[18px] font-bold text-[#555] tracking-[0.02em]
            "
          >
            {dummyUser.grade}
          </div>
          {/* 오레오 등급 이미지 */}
          <div className="flex -space-x-[10px] justify-center items-end">
            {getSnackIcons(dummyUser.grade)}
          </div>

          {/* 경험치 바 섹션 */}
          <div className="flex flex-col items-end h-4/6 absolute right-0 pr-4">
            {/* 경험치 텍스트 */}
            <div className="flex justify-between items-center mb-[8px]">
              <span className="text-[13px] font-semibold text-[#666] tracking-[0.01em]">
                {point} / 100P
              </span>
            </div>

            {/* 경험치 바 배경 */}
            <div
              className="
                relative w-[14px] h-full 
                bg-[#EBF3FF] rounded-[7px]
                shadow-[inset_2px_2px_6px_#D5E2F0,inset_-2px_-2px_6px_#FFFFFF]
                border-[1px] border-[#E2E7FA]
                overflow-hidden
              "
            >
              {/* 경험치 바 진행률 */}
              <div
                className={`
                  absolute bottom-0 left-0 w-full
                  transition-all duration-700 ease-out
                  ${fillCls}
                `}
                style={{
                  height: `${getExpPercentage(point)}%`,
                  // height: `${Math.min(getExpPercentage(point), 100)}%`, // 캡을 더 확실히 하고 싶다면 사용
                }}
              >
                {/* 하이라이트 */}
                <div
                  className={`
                    absolute top-0 left-0 w-full h-[6px]
                    opacity-60
                    ${highlightCls}
                  `}
                />
              </div>
            </div>
          </div>

          {/* 뽑기 버튼 */}
          {isOver100 && (
            <button
              type="button"
              title="뽑기"
              aria-label="뽑기"
              className="
                cursor-pointer
                absolute left-3 bottom-3
                h-[42px] px-[18px]
                bg-[#EBF3FF] rounded-[14px]
                border border-[#E2E7FA]
                text-[#2B5E85] font-semibold text-[14px] tracking-[0.02em]
                shadow-[6px_6px_14px_#DBE4F0,-6px_-6px_14px_#FFFFFF]
                transition-all duration-150
                hover:translate-y-[-1px]
                active:shadow-[inset_3px_3px_8px_#D9E4EE,inset_-3px_-3px_8px_#FFFFFF]
                active:translate-y-0
              "
            >
              🎁 뽑기
            </button>
          )}
        </div>
      </div>

      {/* 하단 마시멜로 히트맵 영역 */}
      <div
        className="
          mt-[26px] bg-[#F8F9FB] rounded-[16px]
          shadow-[4px_4px_19px_rgba(229,230,233,0.55),-4px_-4px_19px_rgba(255,255,255,0.47),0_2px_8px_rgba(219,219,247,0.18),inset_1.7px_2px_7px_rgba(225,230,242,0.19)]
          border border-[#E1E3EB]
          p-[24px] lg:p-[24px_34px]
          flex flex-col gap-[15px] relative
        "
      >
        <div className="flex items-center mb-[6px]">
          <h3 className="text-[24px] font-bold text-[#434343]">
            마시멜로 굽기
          </h3>
        </div>
        <MarshmallowHeatmap />
      </div>
    </div>
  );
};

export default ProfileCard;
