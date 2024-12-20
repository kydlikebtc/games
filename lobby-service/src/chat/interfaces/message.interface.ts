export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  type: 'text' | 'system';
  createdAt: Date;
}
