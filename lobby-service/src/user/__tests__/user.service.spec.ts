import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let testUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);

    // Create a test user
    testUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      balance: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add test user to service
    await service.create(testUser);
  });

  describe('findOne', () => {
    it('should return undefined for non-existent user', async () => {
      const result = await service.findOne('999');
      expect(result).toBeUndefined();
    });

    it('should find an existing user by id', async () => {
      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(result).toEqual(testUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: User = {
        id: '2',
        username: 'newuser',
        email: 'new@example.com',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.create(newUser);
      expect(result).toBeDefined();
      expect(result).toEqual(newUser);

      // Verify user was stored
      const storedUser = await service.findOne('2');
      expect(storedUser).toEqual(newUser);
    });

    it('should override existing user with same id', async () => {
      const updatedUser = {
        ...testUser,
        username: 'updated',
        email: 'updated@example.com'
      };

      const result = await service.create(updatedUser);
      expect(result).toEqual(updatedUser);

      // Verify update was stored
      const storedUser = await service.findOne('1');
      expect(storedUser).toEqual(updatedUser);
    });
  });
});
