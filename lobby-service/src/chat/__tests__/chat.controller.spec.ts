import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../chat.controller';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../interfaces/message.interface';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;
  let testMessage: ChatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);

    testMessage = {
      id: '1',
      roomId: 'room1',
      userId: 'user1',
      content: 'Hello, World!',
      type: 'text',
      createdAt: new Date(),
    };

    // Add test message to service
    await service.create(testMessage);
  });

  describe('findByRoomId', () => {
    it('should return empty array for non-existent room', async () => {
      const result = await controller.findByRoomId('nonexistent');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should find messages for existing room', async () => {
      const result = await controller.findByRoomId('room1');
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testMessage);
    });
  });

  describe('create', () => {
    it('should create a new message', async () => {
      const newMessage: ChatMessage = {
        id: '2',
        roomId: 'room2',
        userId: 'user1',
        content: 'New message',
        type: 'text',
        createdAt: new Date(),
      };

      const result = await controller.create(newMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(newMessage);

      // Verify message was stored
      const messages = await controller.findByRoomId('room2');
      expect(messages).toContainEqual(newMessage);
    });
  });

  describe('deleteByRoomId', () => {
    it('should delete all messages in a room', async () => {
      await controller.deleteByRoomId('room1');
      const result = await controller.findByRoomId('room1');
      expect(result).toHaveLength(0);
    });

    it('should not affect messages in other rooms', async () => {
      const otherMessage: ChatMessage = {
        id: '3',
        roomId: 'room2',
        userId: 'user1',
        content: 'Other room message',
        type: 'text',
        createdAt: new Date(),
      };
      await controller.create(otherMessage);

      await controller.deleteByRoomId('room1');

      const room1Messages = await controller.findByRoomId('room1');
      const room2Messages = await controller.findByRoomId('room2');

      expect(room1Messages).toHaveLength(0);
      expect(room2Messages).toHaveLength(1);
      expect(room2Messages[0]).toEqual(otherMessage);
    });
  });
});
