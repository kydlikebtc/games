import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../interfaces/transaction.interface';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;
  let testTransaction: Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);

    testTransaction = {
      id: '1',
      userId: 'user1',
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add test transaction to service
    await service.create(testTransaction);
  });

  describe('findByUserId', () => {
    it('should return empty array for non-existent user', async () => {
      const result = await controller.findByUserId('nonexistent');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should find transactions for existing user', async () => {
      const result = await controller.findByUserId('user1');
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testTransaction);
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const newTransaction: Transaction = {
        id: '2',
        userId: 'user1',
        type: 'withdraw',
        amount: 500,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await controller.create(newTransaction);
      expect(result).toBeDefined();
      expect(result).toEqual(newTransaction);

      // Verify transaction was stored
      const transactions = await controller.findByUserId('user1');
      expect(transactions).toContainEqual(newTransaction);
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', async () => {
      const originalUpdatedAt = testTransaction.updatedAt;
      const result = await controller.updateStatus('1', 'failed');
      expect(result).toBeDefined();
      expect(result.status).toBe('failed');
      expect(result.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should return undefined for non-existent transaction', async () => {
      const result = await controller.updateStatus('999', 'completed');
      expect(result).toBeUndefined();
    });
  });
});
