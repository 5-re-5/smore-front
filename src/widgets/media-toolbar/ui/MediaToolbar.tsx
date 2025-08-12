import { useNavigate, useParams } from '@tanstack/react-router';
import { Bot, BotOff, MessageCircle } from 'lucide-react';

import {
  useLeaveRoomMutation,
  useDeleteRoomMutation,
} from '@/entities/room/api/queries';
import { useAuth } from '@/entities/user';
import { useFaceDetectionStore } from '@/features/face-detection';
import { useRoomStateStore } from '@/features/room';
import { Button } from '@/shared/ui';
import RoomMediaControls from './RoomMediaControls';
import { getMediaButtonStyle } from './styles';
import { useQueryClient } from '@tanstack/react-query';

type MediaToolbarProps = {
  isChatOpen: boolean;
  onToggleChat: () => void;
  isOwner: boolean;
};

function MediaToolbar({
  isOwner,
  isChatOpen,
  onToggleChat,
}: MediaToolbarProps) {
  const navigate = useNavigate();
  const { roomId } = useParams({ from: '/room/$roomId' });
  const { userId } = useAuth();
  const leaveRoomMutation = useLeaveRoomMutation();
  const deleteRoomMutation = useDeleteRoomMutation();
  const queryClient = useQueryClient();

  const { isFaceDetectionEnabled, setFaceDetectionEnabled } =
    useFaceDetectionStore();
  const { setIntentionalExit } = useRoomStateStore();

  const roomIdNumber = parseInt(roomId, 10);

  const handleLeaveRoom = () => {
    if (!userId) {
      alert('사용자 정보가 없습니다.');
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['study-rooms'] });

    setIntentionalExit(roomIdNumber, true);
    if (isOwner) {
      deleteRoomMutation.mutate(
        { roomId: roomIdNumber, userId },
        {
          onSuccess: () => {
            navigate({ to: '/study-list' });
          },
          onError: (error) => {
            console.error('방 삭제 실패:', error);
            alert('방 삭제에 실패했습니다.');
            setIntentionalExit(roomIdNumber, false);
          },
        },
      );
      return;
    }

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
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#292D32] backdrop-blur-sm border-t border-gray-700 h-16"
        style={{ '--toolbar-h': '64px' } as React.CSSProperties}
      >
        <div className="flex items-center justify-between w-full px-4 py-3 mx-2 sm:px-6">
          {/* 왼쪽: 나가기 버튼 */}
          <div className="flex items-center">
            <Button
              onClick={handleLeaveRoom}
              disabled={
                leaveRoomMutation.isPending || deleteRoomMutation.isPending
              }
              className={`w-2.5rem h-2.5rem rounded-lg bg-[#FF4949] hover:bg-red-600 transition-colors flex items-center justify-center text-white font-bold ${
                leaveRoomMutation.isPending || deleteRoomMutation.isPending
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              aria-label="방 나가기"
            >
              {isOwner ? '방 삭제' : '방 나가기'}
            </Button>
          </div>

          {/* 중앙: 미디어 컨트롤 */}
          <div className="flex items-center space-x-4">
            <RoomMediaControls />
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
              onClick={onToggleChat}
              className={getMediaButtonStyle(isChatOpen)}
              aria-label={`채팅 ${isChatOpen ? '닫기' : '열기'}`}
            >
              <MessageCircle className="w-1.25rem h-1.25rem" />
              <span className="text-sm font-medium hidden sm:block">채팅</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MediaToolbar;
