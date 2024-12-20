import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { TransactionModule } from './transaction/transaction.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UserModule,
    RoomModule,
    TransactionModule,
    ChatModule,
  ],
})
export class AppModule {}
