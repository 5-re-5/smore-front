export interface ChatMessage {
  // id : string, // 추후에 리팩토링 필요
  type: 'GROUP' | 'PRIVATE' | 'SYSTEM';
  sender: {
    userId: number | null; // system 메세지는 null 가능
    nickname: string;
    profileUrl: string;
  };
  content: string;
  timestamp: string;
  receiver?: string;
}
