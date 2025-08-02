import { CameraPreview } from '@/features/prejoin/ui/CameraPreview';
import { PrejoinMicWaveform } from '@/features/prejoin/ui/PrejoinMicWaveform';
import { RoomInfo } from '@/features/prejoin/ui/RoomInfo';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

function PrejoinPage() {
  const { roomId } = useParams({ from: '/room/$roomId/prejoin' });
  const navigate = useNavigate();
  const roomIdNumber = parseInt(roomId, 10);
  const [isJoining, setIsJoining] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleJoinRoom = async () => {
    setIsJoining(true);
    try {
      // TODO: 실제로는 다음 작업들을 수행
      // 1. 비밀번호 검증 (비공개 방인 경우)
      // 2. 미디어 권한 재확인
      // 3. 미디어 기기 설정 저장

      // 설정 완료 후 room으로 이동 (입장 허가 플래그 포함)
      navigate({
        to: '/room/$roomId',
        params: { roomId },
        search: { prejoinCompleted: 'true' }, // prejoin 완료 플래그
      });
    } catch (error) {
      console.error('Failed to join room:', error);
      // TODO: 에러 처리
    } finally {
      setIsJoining(false);
    }
  };

  if (isNaN(roomIdNumber)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">잘못된 방 번호</h1>
          <p className="text-gray-600 mt-2">유효한 방 번호를 입력해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          스터디룸 입장하기
        </h1>
        <div className="h-full w-full bg-[#202020] rounded-lg shadow-lg p-14 px-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 왼쪽: 카메라 미리보기 */}
            <section className="flex items-start space-x-4">
              <PrejoinMicWaveform stream={stream} />
              <div className="flex-1">
                <CameraPreview onStreamChange={setStream} />
              </div>
            </section>

            {/* 오른쪽: 방 정보 및 입장 설정 */}
            <section className="space-y-6">
              <RoomInfo roomId={roomIdNumber} />

              {/* TODO: 비밀번호 입력 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">입장 설정</h3>
                <p className="text-gray-600">비밀번호 및 AI 설정 (구현 예정)</p>
              </div>

              {/* 입장하기 버튼 */}
              <button
                onClick={handleJoinRoom}
                disabled={isJoining}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isJoining ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    입장 중...
                  </>
                ) : (
                  '스터디룸 입장하기'
                )}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrejoinPage;
