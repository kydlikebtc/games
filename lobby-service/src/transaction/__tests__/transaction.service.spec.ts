import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../interfaces/transaction.interface';

describe('TransactionService', () => {
  let service: TransactionService;
  let testTransaction: Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);

    // Create a test transaction
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
      const result = await service.findByUserId('nonexistent');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should find transactions for existing user', async () => {
      const result = await service.findByUserId('user1');
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testTransaction);
    });

    it('should find transactions as recipient', async () => {
      const transferTransaction: Transaction = {
        id: '2',
        userId: 'user2',
        recipientId: 'user1',
        type: 'transfer',
        amount: 500,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await service.create(transferTransaction);

      const result = await service.findByUserId('user1');
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(testTransaction);
      expect(result).toContainEqual(transferTransaction);
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const newTransaction: Transaction = {
        id: '3',
        userId: 'user1',
        type: 'withdraw',
        amount: 500,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.create(newTransaction);
      expect(result).toBeDefined();
      expect(result).toEqual(newTransaction);

      // Verify transaction was stored
      const transactions = await service.findByUserId('user1');
      expect(transactions).toContainEqual(newTransaction);
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', async () => {
      const originalDate = testTransaction.updatedAt;
      const result = await service.updateStatus('1', 'failed');
      expect(result).toBeDefined();
      expect(result.status).toBe('failed');
      expect(result.updatedAt).not.toBe(originalDate);
    });

    it('should return undefined for non-existent transaction', async () => {
      const result = await service.updateStatus('999', 'completed');
      expect(result).toBeUndefined();
    });
  });
});
