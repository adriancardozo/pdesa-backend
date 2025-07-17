import { Injectable } from '@nestjs/common';
import { Review } from './entity/review.entity';
import { EntityManager, FindOneOptions } from 'typeorm';
import { TransactionService } from 'src/transaction/transaction.service';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { ReviewType } from './enum/review-type.enum';
import { FavoriteService } from 'src/favorite/favorite.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { User } from 'src/user/entity/user.entity';
import { ReviewParam } from './param/review.param';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  private readonly userRelations: FindOneOptions<User>['relations'] = {
    favorites: { product: { images: true }, user: true },
    purchases: { product: { images: true }, user: true },
  };

  constructor(
    private readonly userService: UserService,
    private readonly favoriteService: FavoriteService,
    private readonly purchaseService: PurchaseService,
    private readonly transactionService: TransactionService,
  ) {}

  async updateReview(
    { review_type, id }: ReviewParam,
    reviewDto: UpdateReviewDto,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Review> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      const reviewTypeEntity = await this.findReviewTypeEntity(review_type, id, userDto, manager);
      const review = reviewTypeEntity.updateReview(reviewDto);
      await manager.save(reviewTypeEntity);
      reviewTypeEntity.setQueryUser(user);
      reviewTypeEntity.setReviewable();
      return review;
    }, manager);
  }

  async deleteReview(
    { review_type, id }: ReviewParam,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Review> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
      const reviewTypeEntity = await this.findReviewTypeEntity(review_type, id, userDto, manager);
      const review = reviewTypeEntity.deleteReview();
      await manager.save(reviewTypeEntity);
      reviewTypeEntity.setQueryUser(user);
      reviewTypeEntity.setReviewable();
      return review;
    }, manager);
  }

  private async findReviewTypeEntity(
    type: ReviewType,
    id: string,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Favorite | Purchase> {
    return await this.transactionService.transaction(async (manager) => {
      if (type === ReviewType.favorite) {
        return await this.favoriteService.getFavorite({ idMl: id }, userDto, manager);
      } else {
        return await this.purchaseService.getPurchase(id, userDto, manager);
      }
    }, manager);
  }
}
