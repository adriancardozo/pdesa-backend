import { Module } from '@nestjs/common';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FavoriteModule, PurchaseModule, UserModule, TransactionModule],
  providers: [AdminUserService],
  controllers: [AdminUserController],
  exports: [AdminUserService],
})
export class AdminUserModule {}
