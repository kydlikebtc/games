import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../interfaces/message.interface';

describe('ChatService', () => {
  let service: ChatService;
  let testMessage: ChatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);

    // Create a test message
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
      const result = await service.findByRoomId('nonexistent');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should find messages for existing room', async () => {
      const result = await service.findByRoomId('room1');
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testMessage);
    });

    it('should return messages in chronological order', async () => {
      const newMessage: ChatMessage = {
        id: '2',
        roomId: 'room1',
        userId: 'user2',
        content: 'Second message',
        type: 'text',
        createdAt: new Date(testMessage.createdAt.getTime() + 1000),
      };
      await service.create(newMessage);

      const result = await service.findByRoomId('room1');
      expect(result).toHaveLength(2);
      expect(result[0].createdAt.getTime()).toBeLessThan(result[1].createdAt.getTime());
    });
  });

  describe('create', () => {
    it('should create a new message', async () => {
      const newMessage: ChatMessage = {
        id: '3',
        roomId: 'room2',
        userId: 'user1',
        content: 'New message',
        type: 'text',
        createdAt: new Date(),
      };

      const result = await service.create(newMessage);
      expect(result).toBeDefined();
      expect(result).toEqual(newMessage);

      // Verify message was stored
      const messages = await service.findByRoomId('room2');
      expect(messages).toContainEqual(newMessage);
    });
  });

  describe('deleteByRoomId', () => {
    it('should delete all messages in a room', async () => {
      await service.deleteByRoomId('room1');
      const result = await service.findByRoomId('room1');
      expect(result).toHaveLength(0);
    });

    it('should not affect messages in other rooms', async () => {
      const otherMessage: ChatMessage = {
        id: '4',
        roomId: 'room2',
        userId: 'user1',
        content: 'Other room message',
        type: 'text',
        createdAt: new Date(),
      };
      await service.create(otherMessage);

      await service.deleteByRoomId('room1');

      const room1Messages = await service.findByRoomId('room1');
      const room2Messages = await service.findByRoomId('room2');

      expect(room1Messages).toHaveLength(0);
      expect(room2Messages).toHaveLength(1);
      expect(room2Messages[0]).toEqual(otherMessage);
    });
  });
});
