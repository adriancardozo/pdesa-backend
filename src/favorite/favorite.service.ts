import { Injectable } from '@nestjs/common';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { EntityManager } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async addFavorite({ idMl }: AddFavoriteDto, userDto: User, manager?: EntityManager): Promise<Favorite> {
    return await this.transactionService.transaction(async (manager) => {
      const product = await this.productService.getOrCreateProduct(idMl, manager);
      const user = await this.userService.findOneById(userDto.id, ['favorites'], manager);
      const favorite = user.addFavorite(product);
      await manager.save(user);
      return favorite;
    }, manager);
  }
}
