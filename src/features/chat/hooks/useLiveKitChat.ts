// hooks/useLiveKitChat.ts
import { useLocalParticipant } from '@livekit/components-react';
import { useChatMessageStore } from '../model/useChatMessageStore';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

export const useLiveKitChat = () => {
  const { localParticipant } = useLocalParticipant();
  const { addMessage } = useChatMessageStore();

  // 그룹 채팅 전송 (LiveKit 데이터 채널)
  const sendGroupMessage = async (content: string) => {
    const message: ChatMessage = {
      type: 'CHAT',
      sender: {
        userId: 1, // 임시로 숫자 1 사용 (실제로는 로그인한 사용자 ID)
        nickname: localParticipant.name || localParticipant.identity,
        profileUrl: '/default-avatar.png',
      },
      content,
      timestamp: new Date().toISOString(),
    };

    // LiveKit 데이터 채널로 전송
    const encoder = new TextEncoder();
    await localParticipant.publishData(encoder.encode(JSON.stringify(message)));

    // 로컬에도 추가
    addMessage(message);
  };

  const sendPrivateMessage = (receiverId: string, content: string) => {
    const message: ChatMessage = {
      type: 'PRIVATE',
      sender: {
        userId: 1, // 임시로 숫자 1 사용
        nickname: localParticipant.name || localParticipant.identity,
        profileUrl: '/default-avatar.png',
      },
      content,
      timestamp: new Date().toISOString(),
      receiver: receiverId, // 개인 메시지 수신자
    };

    console.log(
      '개인 메시지 (LiveKit 데이터 채널로는 모든 참가자에게 전송됨):',
      message,
    );

    // LiveKit 데이터 채널로 전송 (모든 참가자가 받지만, 클라이언트에서 필터링)
    const encoder = new TextEncoder();
    localParticipant.publishData(encoder.encode(JSON.stringify(message)));

    // 로컬에도 추가
    addMessage(message);
  };

  const sendSystemMessage = (content: string) => {
    const message: ChatMessage = {
      type: 'SYSTEM',
      sender: {
        userId: null, // 시스템 메시지는 null
        nickname: 'SYSTEM',
        profileUrl: '',
      },
      content,
      timestamp: new Date().toISOString(),
    };

    const encoder = new TextEncoder();
    localParticipant.publishData(encoder.encode(JSON.stringify(message)));
    addMessage(message);
  };

  return { sendGroupMessage, sendPrivateMessage, sendSystemMessage };
};
