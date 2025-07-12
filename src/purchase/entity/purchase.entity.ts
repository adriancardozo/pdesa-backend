import type { Product } from 'src/product/entity/product.entity';
import type { User } from 'src/user/entity/user.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import typeorm, { Column, Entity, ManyToOne } from 'typeorm';
import { Review } from 'src/review/entity/review.entity';

@Entity()
export class Purchase extends BaseEntity {
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

  setQueryUser(user: User): Purchase {
    this.product.setQueryUser(user);
    return this;
  }
}
