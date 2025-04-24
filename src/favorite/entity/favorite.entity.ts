import type { Product } from 'src/product/entity/product.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import type { User } from 'src/user/entity/user.entity';
import typeorm, { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Favorite extends BaseEntity {
  @Column()
  rate: number;
  @Column()
  comment: string;
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
}
