import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from '../room.controller';
import { RoomService } from '../room.service';
import { Room } from '../interfaces/room.interface';

describe('RoomController', () => {
  let controller: RoomController;
  let service: RoomService;
  let testRoom: Room;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [RoomService],
    }).compile();

    controller = module.get<RoomController>(RoomController);
    service = module.get<RoomService>(RoomService);

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
      const rooms = await controller.findAll();
      expect(rooms).toBeDefined();
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms).toHaveLength(1);
      expect(rooms[0]).toEqual(testRoom);
    });
  });

  describe('findOne', () => {
    it('should return undefined for non-existent room', async () => {
      const result = await controller.findOne('999');
      expect(result).toBeUndefined();
    });

    it('should find an existing room by id', async () => {
      const result = await controller.findOne('1');
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

      const result = await controller.create(newRoom);
      expect(result).toBeDefined();
      expect(result).toEqual(newRoom);

      // Verify room was stored
      const storedRoom = await controller.findOne('2');
      expect(storedRoom).toEqual(newRoom);
    });
  });

  describe('join', () => {
    it('should add player to room', async () => {
      const result = await controller.join('1', 'user2');
      expect(result).toBeDefined();
      expect(result.currentPlayers).toContain('user2');
    });
  });

  describe('leave', () => {
    it('should remove player from room', async () => {
      const result = await controller.leave('1', 'user1');
      expect(result).toBeDefined();
      expect(result.currentPlayers).not.toContain('user1');
    });
  });
});
