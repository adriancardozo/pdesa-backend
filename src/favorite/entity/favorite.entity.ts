import type { Product } from 'src/product/entity/product.entity';
import { Review } from 'src/review/entity/review.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import type { User } from 'src/user/entity/user.entity';
import typeorm, { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Favorite extends BaseEntity {
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

  get idMl(): string {
    return this.product.idMl;
  }

  constructor(user: User, product: Product) {
    super();
    this.user = user;
    this.product = product;
  }
}
