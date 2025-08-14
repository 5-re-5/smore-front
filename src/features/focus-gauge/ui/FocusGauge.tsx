import { useFaceDetectionStore } from '@/features/face-detection';
import { useRoomMediaToggle } from '@/widgets/media-toolbar/model/useRoomMediaToggle';
import { useFocusStore } from '../model/useFocusStore';

const FOCUS_COLORS = {
  LOW: '#EF4444', // 빨간색: 0-30%
  MEDIUM: '#EAB308', // 노란색: 30-60%
  HIGH: '#22C55E', // 초록색: 60-100%
} as const;

const getFocusColor = (status: number): string => {
  if (status <= 30) return FOCUS_COLORS.LOW;
  if (status <= 60) return FOCUS_COLORS.MEDIUM;
  return FOCUS_COLORS.HIGH;
};

const getFocusLabel = (status: number): string => {
  if (status <= 30) return '집중도 낮음';
  if (status <= 60) return '집중도 보통';
  return '집중도 높음';
};

export const FocusGauge = () => {
  const currentFocus = useFocusStore((state) => state.currentFocus);
  const isFaceDetectionEnabled = useFaceDetectionStore(
    (state) => state.isFaceDetectionEnabled,
  );
  const { isEnabled: isCameraEnabled } = useRoomMediaToggle({
    mediaType: 'camera',
  });

  // 카메라가 꺼져있거나 얼굴 인식이 비활성화된 경우
  if (!isCameraEnabled || !isFaceDetectionEnabled) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center justify-center w-[25rem] h-[3rem] border border-red-500 rounded-lg bg-red-50">
          <span className="text-sm font-medium text-red-600">
            집중도 체크 불가
          </span>
        </div>
        <span className="font-bold text-white text-md">
          얼굴 감지를 활성화 하세요
        </span>
      </div>
    );
  }

  // 아직 집중도 데이터가 없는 경우
  if (!currentFocus) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center justify-center w-[25rem] h-[3rem] border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            집중도 측정 대기중...
          </span>
        </div>
        <span className="font-bold text-white text-md">
          스톱워치를 시작하세요
        </span>
      </div>
    );
  }

  const { status } = currentFocus;
  const focusColor = getFocusColor(status);
  const focusLabel = getFocusLabel(status);

  return (
    <div className="flex flex-col gap-2 items-center">
      {/* 게이지 컨테이너 */}
      <div className="relative w-[25rem] h-[3rem] border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
        {/* 게이지 바 */}
        <div
          className="h-full transition-all duration-[2000ms] ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, status))}%`,
            backgroundColor: focusColor,
          }}
        />

        {/* 퍼센트 텍스트 */}
        <div className="flex absolute inset-0 justify-center items-center">
          <span className="text-sm font-semibold text-gray-800 drop-shadow-sm">
            {Math.round(status)}%
          </span>
        </div>
      </div>

      {/* 라벨 */}
      <span className="font-bold text-md" style={{ color: focusColor }}>
        {focusLabel}
      </span>
    </div>
  );
};
