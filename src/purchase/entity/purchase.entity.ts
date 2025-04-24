import type { Product } from 'src/product/entity/product.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import typeorm, { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Purchase extends BaseEntity {
  @Column()
  price: number;
  @Column()
  amount: number;
  @ManyToOne('Product', (product: Product) => product.purchases)
  product: typeorm.Relation<Product>;
}
