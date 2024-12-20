import { Injectable } from '@nestjs/common';
import { ChatMessage } from './interfaces/message.interface';

@Injectable()
export class ChatService {
  private readonly messages: Map<string, ChatMessage> = new Map();

  async findByRoomId(roomId: string): Promise<ChatMessage[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async create(message: ChatMessage): Promise<ChatMessage> {
    this.messages.set(message.id, message);
    return message;
  }

  async deleteByRoomId(roomId: string): Promise<void> {
    const messages = Array.from(this.messages.entries());
    for (const [id, msg] of messages) {
      if (msg.roomId === roomId) {
        this.messages.delete(id);
      }
    }
  }
}
