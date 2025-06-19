import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { EntityManager, FindOneOptions } from 'typeorm';
import { Purchase } from './entity/purchase.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PurchaseService {
  private readonly userRelations: FindOneOptions<User>['relations'] = {
    purchases: { product: { images: true }, user: true },
  };

  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async getPurchase(id: string, userDto: User, manager?: EntityManager): Promise<Purchase> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      return user.getPurchase(id);
    }, manager);
  }
}
