import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { HashModule } from 'src/hash/hash.module';

@Module({
  imports: [HashModule, TransactionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
