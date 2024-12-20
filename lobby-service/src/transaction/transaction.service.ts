import { Injectable } from '@nestjs/common';
import { Transaction } from './interfaces/transaction.interface';

@Injectable()
export class TransactionService {
  private readonly transactions: Map<string, Transaction> = new Map();

  async findByUserId(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId || tx.recipientId === userId);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async updateStatus(id: string, status: 'completed' | 'failed'): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      await new Promise(resolve => setTimeout(resolve, 10));
      transaction.status = status;
      transaction.updatedAt = new Date();
      this.transactions.set(id, transaction);
    }
    return transaction;
  }
}
