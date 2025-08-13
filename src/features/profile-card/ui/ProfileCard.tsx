import { useState, useEffect, type FunctionComponent } from 'react';
import MarshmallowHeatmap, { type StudyPoint } from './MarshmallowHeatmap';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { request } from '@/shared/api/request';
import { useRouter } from '@tanstack/react-router';
import { DEFAULT_PROFILE_IMG } from '@/shared/constants';

// 스낵 타입 정의
type SnackType = 'O' | 'RE';

interface ProfileCardProps {
  userId: string;
}

// 경험치 퍼센트 계산 함수
const getExpPercentage = (current: number) =>
  Math.min((current / 100) * 100, 100);

// grade 문자열 파싱
function parseSnackTypes(grade: string): SnackType[] {
  const types: SnackType[] = [];
  let i = 0;
  while (i < grade.length) {
    if (grade.startsWith('RE', i)) {
      types.push('RE');
      i += 2;
    } else {
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

// 프로필 이미지
const ProfileImage: FunctionComponent<{ src?: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_PROFILE_IMG);
  return (
    <img
      className="w-[180px] h-[180px] object-cover rounded-[20px] lg:rounded-[32px] border-2 border-[#e6edf7] bg-white shadow-[0_4px_16px_rgba(229,244,255,0.17)]"
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(DEFAULT_PROFILE_IMG)}
      draggable={false}
    />
  );
};

// 룰렛 모달
const RouletteModal: React.FC<{
  open: boolean;
  result?: SnackType | null;
  onClose: () => void;
}> = ({ open, result, onClose }) => {
  const items: SnackType[] = ['O', 'RE'];
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [settled, setSettled] = useState<SnackType | null>(null);

  useEffect(() => {
    if (!open) return;
    setSettled(null);
    setSpinning(true);
    const interval = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      80,
    );

    if (result) {
      const stopTimer = setTimeout(() => {
        let step = 0;
        const slow = setInterval(() => {
          setIndex((i) => (i + 1) % items.length);
          step++;
          if (step > 10) {
            clearInterval(slow);
            setSpinning(false);
            setSettled(result);
          }
        }, 120);
        clearInterval(interval);
      }, 600);
      return () => {
        clearInterval(interval);
        clearTimeout(stopTimer);
      };
    }
    return () => clearInterval(interval);
  }, [open, result]);

  if (!open) return null;
  const current: SnackType = settled ?? items[index];
  const imgSrc =
    current === 'O' ? '/images/OREO_O.webp' : '/images/OREO_RE.webp';

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="relative w-[360px] max-w-[90vw] rounded-2xl bg-[#EBF3FF] px-6 py-6 border border-[#E2E7FA] shadow-[10px_10px_24px_rgba(0,0,0,0.15),-10px_-10px_24px_#FFF]">
        <h4 className="text-center text-[18px] font-semibold text-[#2B5E85] mb-3">
          오레오 룰렛
        </h4>
        <div className="mx-auto mb-4 h-[140px] w-[200px] overflow-hidden rounded-xl border border-[#D7E3F3] bg-white shadow-[inset_0_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <img
            key={current}
            src={imgSrc}
            alt={current}
            className={`h-[120px] w-auto transition-transform duration-150 ${spinning ? 'scale-100' : 'scale-105'}`}
            draggable={false}
          />
        </div>
        <div className="text-center text-sm text-[#597997] min-h-[22px] mb-2">
          {spinning && !result && '돌리는 중...'}
          {spinning && result && '감속 중...'}
          {!spinning && settled && (settled === 'RE' ? 'RE 당첨!' : 'O 당첨!')}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-[40px] rounded-[12px] bg-[#EBF3FF] border border-[#E2E7FA] text-[#2B5E85] font-semibold text-[14px] shadow-[6px_6px_14px_#DBE4F0,-6px_-6px_14px_#FFFFFF] hover:translate-y-[-1px] transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({ userId }) => {
  const router = useRouter();
  const { data: userInfo } = useUserInfo();

  // 상태값
  const [point, setPoint] = useState(0);
  const [grade, setGrade] = useState<string>(userInfo?.level ?? '');
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<SnackType | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [streak, setStreak] = useState(0);
  const [studyPoints, setStudyPoints] = useState<StudyPoint[]>([]);

  // userInfo.level 반영
  useEffect(() => {
    if (userInfo?.level) setGrade(userInfo.level);
  }, [userInfo?.level]);

  // 포인트 조회
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
    if (userId) fetchPoints();
  }, [userId]);

  // 뽑기 실행
  const handleDraw = async () => {
    if (point < 100 || drawing) return;
    try {
      setDrawing(true);
      setRouletteResult(null);
      setRouletteOpen(true);
      const res = await request<{
        result: SnackType;
        updatedLevel: string;
        updatedPoints: number;
      }>({
        method: 'post',
        url: `/api/v1/points/${userId}`,
      });
      setRouletteResult(res.data.result);
      setTimeout(() => {
        setPoint(res.data.updatedPoints);
        setGrade(res.data.updatedLevel);
      }, 900);
    } catch (err) {
      console.error('뽑기 실패:', err);
      setRouletteOpen(false);
    } finally {
      setTimeout(() => setDrawing(false), 1200);
    }
  };

  // 공부 통계 조회
  useEffect(() => {
    type StatsResponse = {
      userId: number;
      totalAttendance: number;
      weekdayGraph: number[];
      weeklyGraph: number[];
      studyTrack: { points: { date: string; minutes: number }[] };
    };
    const fetchStats = async () => {
      try {
        const res = await request<StatsResponse>({
          method: 'get',
          url: `/api/v1/study-times/statistics/${userId}`,
        });
        setStreak(res.data.totalAttendance);
        setStudyPoints(res.data.studyTrack.points);
      } catch (err) {
        console.error('공부 통계 조회 실패:', err);
      }
    };
    if (userId) fetchStats();
  }, [userId]);

  const dummyUser = {
    name: userInfo?.nickname,
    streak: 25,
    goal: userInfo?.targetDateTitle,
    grade: grade,
    profileImg: userInfo?.profileUrl || ' ',
  };

  const isOver100 = point >= 100;
  const fillCls = isOver100
    ? 'bg-gradient-to-t from-[#22C55E] to-[#16A34A] shadow-[1px_1px_4px_rgba(22,163,74,0.4)]'
    : 'bg-gradient-to-t from-[#357ABD] to-[#4A90E2] shadow-[1px_1px_4px_rgba(74,144,226,0.4)]';
  const highlightCls = isOver100
    ? 'bg-gradient-to-t from-[#86EFAC] to-[#22C55E]'
    : 'bg-gradient-to-t from-[#6BA6F0] to-[#4A90E2]';

  return (
    <div className="w-full max-w-[100vw] lg:max-w-[1200px] max-h-[700px] bg-[#EBF3FF] rounded-[25px] shadow-[-10px_-10px_20px_#FFF,10px_10px_20px_rgba(0,0,0,0.09)] flex flex-col py-[65px] px-[56px] gap-[16px] lg:gap-[38px] relative">
      <RouletteModal
        open={rouletteOpen}
        result={rouletteResult}
        onClose={() => setRouletteOpen(false)}
      />
      <div className="w-full flex justify-between items-center h-[192px]">
        {/* 프로필 */}
        <div className="flex w-[590px]">
          <div className="relative w-[180px] h-[180px] flex flex-col items-center">
            <ProfileImage src={dummyUser.profileImg} alt="프로필 이미지" />
            <button
              onClick={() => router.navigate({ to: '/edit-page' })}
              title="프로필 수정"
              className="cursor-pointer w-[50px] h-[50px] absolute right-[-10px] bottom-[-10px]"
            >
              {/* svg 아이콘 생략 (동일) */}
            </button>
          </div>
          {/* 사용자 정보 */}
          <div className="ml-[30px] grid w-[397px] h-[192px] py-[25px] px-[10px] gap-y-[21px] gap-x-[21px] grid-rows-3 grid-cols-1">
            <div className="text-[#616161] [font-family:Montserrat] text-[24px] font-bold leading-[133.4%] tracking-[0.12px]">{`연속 ${streak}일 출석!`}</div>
            <div className="text-[32px] font-bold text-[#154559]">
              {dummyUser.name}
            </div>
            <div className="text-[24px] font-bold text-[#19C4B2]">
              {dummyUser.goal}
            </div>
          </div>
        </div>
        {/* 등급 카드 */}
        <div className="flex flex-col gap-[12px] items-center justify-center w-[450px] h-[190px] bg-[#EBF3FF] rounded-[18px] shadow-[5px_5px_15px_#DBE4F0,-5px_-5px_15px_#FFF,inset_2.5px_2.5px_6px_#D9E4EE,inset_-3px_-3px_8px_#FFF] border-[1.5px] border-[#E2E7FA] p-[9px] lg:p-[13px_18px] mr-[6px] relative">
          <div
            className="w-[250px] h-[45px] bg-[#EBF3FF] rounded-[141px] z-[99999] absolute flex items-center justify-center top-[-20px] text-[18px] font-bold text-[#555] tracking-[0.02em]"
            style={{
              filter:
                'drop-shadow(4px 4px 15px #B4C1D5) drop-shadow(-4px -4px 15px #FFFFFF)',
            }}
          >
            {dummyUser.grade}
          </div>
          <div className="flex -space-x-[10px] justify-center items-end">
            {getSnackIcons(dummyUser.grade)}
          </div>
          {/* 경험치 바 */}
          <div className="flex flex-col items-end h-4/6 absolute right-0 pr-4">
            <div className="flex justify-between items-center mb-[8px]">
              <span className="text-[13px] font-semibold text-[#666] tracking-[0.01em]">
                {point} / 100P
              </span>
            </div>
            <div className="relative w-[14px] h-full bg-[#EBF3FF] rounded-[7px] shadow-[inset_2px_2px_6px_#D5E2F0,inset_-2px_-2px_6px_#FFFFFF] border-[1px] border-[#E2E7FA] overflow-hidden">
              <div
                className={`absolute bottom-0 left-0 w-full transition-all duration-700 ease-out ${fillCls}`}
                style={{ height: `${getExpPercentage(point)}%` }}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-[6px] opacity-60 ${highlightCls}`}
                />
              </div>
            </div>
          </div>
          {isOver100 && (
            <button
              type="button"
              title="뽑기"
              aria-label="뽑기"
              onClick={handleDraw}
              disabled={drawing}
              className={`cursor-pointer absolute left-3 bottom-3 h-[42px] px-[18px] rounded-[14px] border border-[#E2E7FA] text-[#2B5E85] font-semibold text-[14px] tracking-[0.02em] shadow-[6px_6px_14px_#DBE4F0,-6px_-6px_14px_#FFFFFF] transition-all duration-150 hover:translate-y-[-1px] active:shadow-[inset_3px_3px_8px_#D9E4EE,inset_-3px_-3px_8px_#FFFFFF] active:translate-y-0 ${drawing ? 'opacity-60 pointer-events-none' : 'bg-[#EBF3FF]'}`}
            >
              🎁 뽑기
            </button>
          )}
        </div>
      </div>
      {/* 하단 히트맵 */}
      <div className="mt-[26px] bg-[#F8F9FB] rounded-[16px] shadow-[4px_4px_19px_rgba(229,230,233,0.55),-4px_-4px_19px_rgba(255,255,255,0.47),0_2px_8px_rgba(219,219,247,0.18),inset_1.7px_2px_7px_rgba(225,230,242,0.19)] border border-[#E1E3EB] p-[24px] lg:p-[24px_34px] flex flex-col gap-[15px] relative">
        <div className="flex items-center mb-[6px]">
          <h3 className="text-[24px] font-bold text-[#434343]">
            마시멜로 굽기
          </h3>
        </div>
        <MarshmallowHeatmap points={studyPoints} />
      </div>
    </div>
  );
};

export default ProfileCard;
