import { Module } from '@nestjs/common';
import { InitialDataService } from './initial-data.service';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [UserModule, TransactionModule],
  providers: [InitialDataService],
})
export class InitialDataModule {
  constructor(private readonly initialDataService: InitialDataService) {}

  async onModuleInit() {
    await this.initialDataService.initialize();
  }
}
