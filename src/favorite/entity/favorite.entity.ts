import { BadRequestException } from '@nestjs/common';
import { Configuration } from 'src/config/configuration';
import type { Product } from 'src/product/entity/product.entity';
import { Review } from 'src/review/entity/review.entity';
import { ReviewType } from 'src/review/enum/review-type.enum';
import { Reviewable } from 'src/review/type/reviewable.type';
import { CONFIG_SERVICE } from 'src/shared/config/config.service';
import { BaseEntity } from 'src/shared/entity/base.entity';
import type { User } from 'src/user/entity/user.entity';
import typeorm, { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

const errors = CONFIG_SERVICE.get<Configuration['error']['message']>('error.message')!;

@Entity()
export class Favorite extends BaseEntity implements Reviewable {
  @Column(() => Review)
  review: Review;
  @Column({ nullable: true })
  userId: string;
  @Column({ nullable: true })
  productId: string;
  @ManyToOne('User', (user: User) => user.favorites)
  @JoinColumn({ name: 'userId' })
  user: typeorm.Relation<User>;
  @ManyToOne('Product', (product: Product) => product.favorites)
  @JoinColumn({ name: 'productId' })
  product: typeorm.Relation<Product>;

  queryUser: User;

  get idMl(): string {
    return this.product.idMl;
  }

  get isFavorite(): boolean {
    if (!this.queryUser) throw new BadRequestException(errors.notQueryUser);
    return this.queryUser.favorites?.some((favorite) => favorite.idMl === this.idMl) ?? false;
  }

  get reviewType(): ReviewType {
    return ReviewType.favorite;
  }

  get reviewed(): boolean {
    return this.review.reviewed;
  }

  constructor(user: User, product: Product) {
    super();
    this.user = user;
    this.product = product;
  }

  getReview(checkReviewed: boolean = true): Review {
    this.review.setReviewable(this);
    return this.review.get(checkReviewed);
  }

  setQueryUser(user: User) {
    this.queryUser = user;
  }
}
