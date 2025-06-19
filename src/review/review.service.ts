import { BadRequestException, Injectable } from '@nestjs/common';
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
import { GetReviewsQuery } from './query/get-reviews.query';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entity/product.entity';
import { ReviewerType } from './enum/reviewer-type.enum';
import { Configuration } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
  private readonly errors: Configuration['error']['message'];
  private readonly userRelations: FindOneOptions<User>['relations'] = {
    favorites: { product: { images: true }, user: true },
    purchases: { product: { images: true }, user: true },
  };
  private readonly productRelations: FindOneOptions<Product>['relations'] = {
    favorites: { product: { images: true }, user: true },
    purchases: { product: { images: true }, user: true },
  };

  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly favoriteService: FavoriteService,
    private readonly purchaseService: PurchaseService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
  ) {
    this.errors = this.configService.get('error.message')!;
  }

  async getReviews(
    { review_type, id, reviewers }: GetReviewsQuery,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Array<Review>> {
    return await this.transactionService.transaction(async (manager) => {
      if (reviewers === ReviewerType.all && id) {
        const product = await this.productService.getProductByIdMl(id, this.productRelations, manager);
        return product.reviews(review_type);
      } else if (reviewers === ReviewerType.owner) {
        const user = await this.userService.findOneById(userDto.id, this.userRelations, manager);
        return user.reviews(review_type, id);
      }
      throw new BadRequestException(this.errors.reviewsOfNoneProduct);
    }, manager);
  }

  async getReview(
    { review_type, id }: ReviewParam,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Review> {
    return await this.transactionService.transaction(async (manager) => {
      const reviewTypeEntity = await this.findReviewTypeEntity(review_type, id, userDto, manager);
      return reviewTypeEntity.getReview();
    }, manager);
  }

  async updateReview(
    { review_type, id }: ReviewParam,
    reviewDto: UpdateReviewDto,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Review> {
    return await this.transactionService.transaction(async (manager) => {
      const reviewTypeEntity = await this.findReviewTypeEntity(review_type, id, userDto, manager);
      const review = reviewTypeEntity.getReview(false).update(reviewDto);
      await manager.save(reviewTypeEntity);
      return review;
    }, manager);
  }

  async deleteReview(
    { review_type, id }: ReviewParam,
    userDto: User,
    manager?: EntityManager,
  ): Promise<Review> {
    return await this.transactionService.transaction(async (manager) => {
      const reviewTypeEntity = await this.findReviewTypeEntity(review_type, id, userDto, manager);
      const review = reviewTypeEntity.getReview().delete();
      await manager.save(reviewTypeEntity);
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
