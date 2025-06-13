import { Injectable } from '@nestjs/common';
import { IdMlDto } from './dto/id-ml.dto';
import { EntityManager, FindOneOptions } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entity/product.entity';

@Injectable()
export class FavoriteService {
  private readonly userRelations: FindOneOptions<User>['relations'] = {
    favorites: { product: { images: true } },
  };
  private readonly productRelations: FindOneOptions<Product>['relations'] = { images: true };

  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async getFavorites(userDto: User, manager?: EntityManager): Promise<Array<Favorite>> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      return user.favorites;
    }, manager);
  }

  async getFavorite({ idMl }: IdMlDto, userDto: User, manager?: EntityManager): Promise<Favorite> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      return user.getFavorite(idMl);
    }, manager);
  }

  async addFavorite({ idMl }: IdMlDto, userDto: User, manager?: EntityManager): Promise<Favorite> {
    return await this.transactionService.transaction(async (manager) => {
      const product = await this.productService.getOrCreateProduct(idMl, this.productRelations, manager);
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      const favorite = user.addFavorite(product);
      await manager.save(user);
      return favorite;
    }, manager);
  }

  async deleteFavorite({ idMl }: IdMlDto, userDto: User, manager?: EntityManager): Promise<Favorite> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      const favorite = user.deleteFavorite(idMl);
      await manager.save(user);
      await manager.softRemove(favorite);
      return favorite;
    }, manager);
  }
}
