export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  recipientId?: string;
  createdAt: Date;
  updatedAt: Date;
}
