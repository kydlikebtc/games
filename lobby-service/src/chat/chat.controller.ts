import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './interfaces/message.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('room/:roomId')
  async findByRoomId(@Param('roomId') roomId: string): Promise<ChatMessage[]> {
    return this.chatService.findByRoomId(roomId);
  }

  @Post()
  async create(@Body() message: ChatMessage): Promise<ChatMessage> {
    return this.chatService.create(message);
  }

  @Delete('room/:roomId')
  async deleteByRoomId(@Param('roomId') roomId: string): Promise<void> {
    return this.chatService.deleteByRoomId(roomId);
  }
}
