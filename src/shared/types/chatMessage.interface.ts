export interface ChatMessage {
  type: 'CHAT' | 'PRIVATE' | 'SYSTEM';
  sender: {
    userId: number | null; // system 메세지는 null 가능
    nickname: string;
    profileUrl: string;
  };
  content: string;
  timestamp: string;
  receiver?: string;
}
