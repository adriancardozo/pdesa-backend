import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { EntityManager } from 'typeorm';
import { defaults } from './data/data';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class InitialDataService {
  private readonly errors: Configuration['error']['message'];

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {
    this.errors = this.configService.get('error.message')!;
  }

  async initialize(manager?: EntityManager) {
    await this.transactionService.transaction(async (manager) => {
      await this.run(() => this.userService.create(defaults.purchaser, manager));
    }, manager);
  }

  private async run<T>(callback: () => Promise<T>): Promise<T | null> {
    try {
      return await callback();
    } catch (error) {
      if (error.message && this.errors.userAlreadyExists === error.message) return null;
      throw error;
    }
  }
}
