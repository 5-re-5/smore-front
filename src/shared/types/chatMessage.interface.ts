export type ChatMessageType = 'GROUP' | 'PRIVATE' | 'SYSTEM';

export interface ChatMessage {
  type: ChatMessageType;
  sender: {
    userId: number | null; // system 메세지는 null 가능
    nickname: string;
    profileUrl: string;
  };
  content: string;
  timestamp: string;
  receiver?: string;
}
