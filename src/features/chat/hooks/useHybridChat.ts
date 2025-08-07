import { useLiveKitChat } from './useLiveKitChat';
import { useStompChat } from './useStompChat';

export const useHybridChat = () => {
  const liveKitChat = useLiveKitChat();
  const stompChat = useStompChat();

  // 전체 채팅: LiveKit 데이터 채널 사용
  const sendGroupMessage = (content: string) => {
    return liveKitChat.sendGroupMessage(content);
  };

  // 개인 채팅: STOMP 사용
  const sendPrivateMessage = (receiverId: string, content: string) => {
    return stompChat.sendPrivateMessage(receiverId, content);
  };

  // 시스템 메시지: STOMP 사용
  const sendSystemMessage = (content: string) => {
    return stompChat.sendSystemMessage(content);
  };

  return {
    sendGroupMessage,
    sendPrivateMessage,
    sendSystemMessage,
  };
};
