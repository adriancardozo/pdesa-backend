import { Injectable } from '@nestjs/common';
import { IdMlDto } from 'src/favorite/dto/id-ml.dto';
import { User } from 'src/user/entity/user.entity';
import { EntityManager, FindOneOptions } from 'typeorm';
import { Purchase } from './entity/purchase.entity';
import { Product } from 'src/product/entity/product.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { PurchaseDto } from './dto/purchase.dto';

@Injectable()
export class PurchaseService {
  private readonly userRelations: FindOneOptions<User>['relations'] = {
    purchases: { product: { images: true, favorites: true }, user: true },
  };
  private readonly productRelations: FindOneOptions<Product>['relations'] = {
    images: true,
    favorites: true,
  };

  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async purchases(userDto: User, manager?: EntityManager): Promise<Array<Purchase>> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      user.setQueryUser(user);
      return user.purchases;
    }, manager);
  }

  async purchase(
    { idMl }: IdMlDto,
    { amount }: PurchaseDto,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Purchase> {
    return await this.transactionService.transaction(async (manager) => {
      const product = await this.productService.getOrCreateProduct(idMl, this.productRelations, manager);
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      const purchase = user.purchase(product, amount);
      await manager.save(user);
      return purchase.setQueryUser(user);
    }, manager);
  }

  async getPurchase(id: string, userDto: User, manager?: EntityManager): Promise<Purchase> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      return user.getPurchase(id);
    }, manager);
  }
}
