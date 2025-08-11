import { useParticipants } from '@livekit/components-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Bot, BotOff, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { useLeaveRoomMutation } from '@/entities/room/api/queries';
import { useAuth } from '@/entities/user';
import { useFaceDetectionStore } from '@/features/face-detection';
import { useRoomStateStore } from '@/features/room';
import { Button } from '@/shared/ui';
import ChatPanel from '@/features/chat/ui/ChatPanel';
import RoomMediaControls from './RoomMediaControls';
import { getMediaButtonStyle } from './styles';

function MediaToolbar() {
  const navigate = useNavigate();
  const { roomId } = useParams({ from: '/room/$roomId' });
  const { userId } = useAuth();
  const leaveRoomMutation = useLeaveRoomMutation();

  const [showParticipants, setShowParticipants] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const participants = useParticipants();
  const { isFaceDetectionEnabled, setFaceDetectionEnabled } =
    useFaceDetectionStore();
  const { setIntentionalExit } = useRoomStateStore();

  const participantCount = participants.length;
  const roomIdNumber = parseInt(roomId, 10);

  const handleLeaveRoom = () => {
    if (!userId) {
      alert('사용자 정보가 없습니다.');
      return;
    }

    setIntentionalExit(roomIdNumber, true);

    leaveRoomMutation.mutate(
      { roomId: roomIdNumber, userId },
      {
        onSuccess: () => {
          navigate({ to: '/study-list' });
        },
        onError: (error) => {
          console.error('방 나가기 실패:', error);
          alert('방 나가기에 실패했습니다.');
          setIntentionalExit(roomIdNumber, false);
        },
      },
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#292D32] backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-between w-full px-4 py-3 mx-2 sm:px-6">
          {/* 왼쪽: 나가기 버튼 */}
          <div className="flex items-center">
            <Button
              onClick={handleLeaveRoom}
              disabled={leaveRoomMutation.isPending}
              className={`w-2.5rem h-2.5rem rounded-lg bg-[#FF4949] hover:bg-red-600 transition-colors flex items-center justify-center text-white font-bold ${
                leaveRoomMutation.isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              aria-label="방 나가기"
            >
              방 나가기
            </Button>
          </div>

          {/* 중앙: 미디어 컨트롤 */}
          <div className="flex items-center space-x-4">
            <RoomMediaControls />

            {/* AI 얼굴 감지 */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setFaceDetectionEnabled(!isFaceDetectionEnabled)}
                className={getMediaButtonStyle(isFaceDetectionEnabled)}
                aria-label={`AI 얼굴 감지 ${isFaceDetectionEnabled ? '비활성화' : '활성화'}`}
              >
                {isFaceDetectionEnabled ? (
                  <Bot className="w-1.25rem h-1.25rem " />
                ) : (
                  <BotOff className="w-1.25rem h-1.25rem " />
                )}
                <span className=" pl-2 text-sm font-medium hidden sm:block">
                  얼굴 감지
                </span>
              </Button>
            </div>
          </div>

          {/* 오른쪽: 채팅 + 참가자 */}
          <div className="flex items-center space-x-3">
            {/* 채팅 버튼 */}
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center space-x-2 px-0.75rem py-0.5rem rounded-full ${
                isChatOpen
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-800 hover:bg-gray-700'
              } transition-colors`}
              aria-label={`채팅 ${isChatOpen ? '닫기' : '열기'}`}
            >
              <MessageCircle className="w-1.25rem h-1.25rem text-white" />
              <span className="text-white text-sm font-medium hidden sm:block">
                채팅
              </span>
            </Button>

            {/* 참가자 목록 */}
            <div className="relative">
              <Button
                onClick={() => setShowParticipants(!showParticipants)}
                className="flex items-center space-x-2 px-0.75rem py-0.5rem rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label={`참가자 목록 ${showParticipants ? '숨기기' : '보기'}`}
              >
                <Users className="w-1.25rem h-1.25rem text-white" />
                <span className="text-white text-sm font-medium hidden sm:block">
                  {participantCount}
                </span>
              </Button>

              {/* 참가자 드롭다운 */}
              {showParticipants && (
                <div className="absolute bottom-full right-0 mb-0.5rem w-16rem bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  <div className="p-0.75rem border-b border-gray-700">
                    <h3 className="text-white font-medium text-sm">
                      참가자 ({participantCount})
                    </h3>
                  </div>
                  <div className="max-h-15rem overflow-y-auto">
                    {participants.map((participant) => (
                      <div
                        key={participant.identity}
                        className="flex items-center justify-between px-0.75rem py-0.5rem hover:bg-gray-700"
                      >
                        <span className="text-white text-sm">
                          {participant.identity}
                          {participant.isLocal && (
                            <span className="text-gray-400 text-xs ml-1">
                              (나)
                            </span>
                          )}
                        </span>
                        <div className="flex items-center space-x-0.25rem">
                          <span className="text-green-400 text-xs">🎤</span>
                          <span className="text-green-400 text-xs">📹</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 채팅 패널 - MediaToolbar와 독립적으로 렌더링 */}
      {isChatOpen && (
        <div className="fixed right-0 top-0 h-full z-[9999] shadow-2xl">
          <ChatPanel isOpen={isChatOpen} />
        </div>
      )}
    </>
  );
}
export default MediaToolbar;
