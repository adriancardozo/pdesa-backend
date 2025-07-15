import { Injectable } from '@nestjs/common';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { FavoriteService } from 'src/favorite/favorite.service';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { PurchaseService } from 'src/purchase/purchase.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly purchaseService: PurchaseService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async user(id: string, user: User, manager?: EntityManager): Promise<User> {
    return await this.transactionService.transaction(async (manager) => {
      return await this.userService.findOneById(id, undefined, manager);
    }, manager);
  }

  async favorites(id: string, userDto: User, manager?: EntityManager): Promise<Array<Favorite>> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(id, undefined, manager);
      return await this.favoriteService.getFavorites(user, manager);
    }, manager);
  }

  async purchases(id: string, userDto: User, manager?: EntityManager): Promise<Array<Purchase>> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(id, undefined, manager);
      return await this.purchaseService.purchases(user, manager);
    }, manager);
  }
}
