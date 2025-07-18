import type { Product } from 'src/product/entity/product.entity';
import type { User } from 'src/user/entity/user.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import typeorm, { Column, Entity, ManyToOne } from 'typeorm';
import { Review } from 'src/review/entity/review.entity';
import type { Reviewable } from 'src/review/type/reviewable.type';
import { ReviewType } from 'src/review/enum/review-type.enum';
import type { ReviewData } from 'src/review/type/review-data.type';

@Entity()
export class Purchase extends BaseEntity implements Reviewable {
  @Column()
  price: number;
  @Column()
  amount: number;
  @Column(() => Review)
  review: Review;
  @ManyToOne('Product', (product: Product) => product.purchases)
  product: typeorm.Relation<Product>;
  @ManyToOne('User', (user: User) => user.purchases)
  user: typeorm.Relation<User>;

  get idMl(): string {
    return this.product.idMl;
  }

  get reviewType(): ReviewType {
    return ReviewType.purchase;
  }

  get reviewed(): boolean {
    return this.review.reviewed;
  }

  get finalPrice(): number {
    return this.price * this.amount;
  }

  constructor(amount: number, user: User, product: Product) {
    super();
    this.user = user;
    this.product = product;
    this.amount = amount;
    this.price = product?.price;
  }

  updateReview(data: ReviewData): Review {
    return this.review.update(data);
  }

  deleteReview(): Review {
    return this.review.delete();
  }

  setReviewable() {
    this.review.setReviewable(this);
  }

  setQueryUser(user: User): Purchase {
    this.product?.setQueryUser(user);
    return this;
  }
}
