import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from '../room.service';
import { Room } from '../interfaces/room.interface';

describe('RoomService', () => {
  let service: RoomService;
  let testRoom: Room;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    service = module.get<RoomService>(RoomService);

    // Create a test room
    testRoom = {
      id: '1',
      name: 'Test Room',
      gameType: 'poker',
      maxPlayers: 6,
      currentPlayers: ['user1'],
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add test room to service
    await service.create(testRoom);
  });

  describe('findAll', () => {
    it('should return an array of rooms', async () => {
      const rooms = await service.findAll();
      expect(rooms).toBeDefined();
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms).toHaveLength(1);
      expect(rooms[0]).toEqual(testRoom);
    });
  });

  describe('findOne', () => {
    it('should return undefined for non-existent room', async () => {
      const result = await service.findOne('999');
      expect(result).toBeUndefined();
    });

    it('should find an existing room by id', async () => {
      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(result).toEqual(testRoom);
    });
  });

  describe('create', () => {
    it('should create a new room', async () => {
      const newRoom: Room = {
        id: '2',
        name: 'New Room',
        gameType: 'poker',
        maxPlayers: 4,
        currentPlayers: [],
        status: 'waiting',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.create(newRoom);
      expect(result).toBeDefined();
      expect(result).toEqual(newRoom);

      // Verify room was stored
      const storedRoom = await service.findOne('2');
      expect(storedRoom).toEqual(newRoom);
    });
  });

  describe('join', () => {
    it('should add player to room if not full', async () => {
      const result = await service.join('1', 'user2');
      expect(result).toBeDefined();
      expect(result.currentPlayers).toContain('user2');
      expect(result.currentPlayers).toHaveLength(2);
    });

    it('should not add player if room is full', async () => {
      // Fill the room
      for (let i = 2; i <= 6; i++) {
        await service.join('1', `user${i}`);
      }

      const result = await service.join('1', 'user7');
      expect(result.currentPlayers).toHaveLength(6);
      expect(result.currentPlayers).not.toContain('user7');
    });
  });

  describe('leave', () => {
    it('should remove player from room', async () => {
      const result = await service.leave('1', 'user1');
      expect(result).toBeDefined();
      expect(result.currentPlayers).not.toContain('user1');
      expect(result.currentPlayers).toHaveLength(0);
    });

    it('should handle non-existent player gracefully', async () => {
      const result = await service.leave('1', 'nonexistent');
      expect(result).toBeDefined();
      expect(result.currentPlayers).toEqual(['user1']);
    });
  });
});
