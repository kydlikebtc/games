import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './interfaces/transaction.interface';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Transaction[]> {
    return this.transactionService.findByUserId(userId);
  }

  @Post()
  async create(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionService.create(transaction);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'completed' | 'failed'
  ): Promise<Transaction | undefined> {
    return this.transactionService.updateStatus(id, status);
  }
}
