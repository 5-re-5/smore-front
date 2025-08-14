export interface ChatMessageInput {
  content: string;
  type: 'GROUP' | 'PRIVATE';
  receiver?: string;
}
