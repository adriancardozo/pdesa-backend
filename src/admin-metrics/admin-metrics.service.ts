import { Injectable, Type } from '@nestjs/common';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Product } from 'src/product/entity/product.entity';
import { ProductService } from 'src/product/product.service';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { EntityManager, EntityTarget, FindOneOptions, ObjectLiteral } from 'typeorm';

@Injectable()
export class AdminMetricsService {
  private readonly userRelations: FindOneOptions<User>['relations'] = { purchases: true };
  private readonly productRelations: FindOneOptions<Product>['relations'] = {
    images: true,
    favorites: true,
    purchases: true,
  };

  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly transactionService: TransactionService,
  ) {}

  async top5Purchased(user: User, manager?: EntityManager): Promise<Array<Product>> {
    return await this.transactionService.transaction(async (manager) => {
      const products = await this.top5(
        Product,
        'product',
        [{ entity: Purchase, alias: 'purchase' }],
        'SUM(purchase.amount)',
        async (ids) => await this.productService.findProductsByIds(ids, this.productRelations, manager),
        user,
        manager,
      );
      return products
        .map((product) => product.setQueryUser(user))
        .toSorted((a, b) => b.amountPurchases - a.amountPurchases);
    }, manager);
  }

  async top5Favorited(user: User, manager?: EntityManager): Promise<Array<Product>> {
    return await this.transactionService.transaction(async (manager) => {
      const products = await this.top5(
        Product,
        'product',
        [{ entity: Favorite, alias: 'favorite' }],
        'COUNT(*)',
        async (ids) => await this.productService.findProductsByIds(ids, this.productRelations, manager),
        user,
        manager,
      );
      return products
        .map((product) => product.setQueryUser(user))
        .toSorted((a, b) => b.amountFavorites - a.amountFavorites);
    }, manager);
  }

  async top5Purchaser(user: User, manager?: EntityManager): Promise<Array<User>> {
    return await this.transactionService.transaction(async (manager) => {
      const users = await this.top5(
        User,
        'user',
        [{ entity: Purchase, alias: 'purchase' }],
        'COUNT(*)',
        async (ids) => await this.userService.findUsersByIds(ids, this.userRelations, manager),
        user,
        manager,
      );
      return users
        .map((user) => user.setQueryUser(user))
        .toSorted((a, b) => b.amountPurchases - a.amountPurchases);
    }, manager);
  }

  private async top5<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
    alias: string,
    joinEntities: Array<{ entity: Type; alias: string }>,
    orderBy: string,
    callback: (ids: Array<{ id: string }>) => Promise<Array<T>>,
    user: User,
    manager?: EntityManager,
  ): Promise<Array<T>> {
    return await this.transactionService.transaction(async (manager) => {
      let query = manager.getRepository(entity).createQueryBuilder(alias).select(`${alias}.id as id`);
      for (const { entity, alias: joinAlias } of joinEntities) {
        query = query.innerJoin(entity, joinAlias, `${alias}.id=${joinAlias}.${alias}Id`);
      }
      query = query.groupBy(`${alias}.id`).orderBy(orderBy, 'DESC').limit(5);
      const ids = await query.execute();
      return await callback(ids);
    }, manager);
  }
}
