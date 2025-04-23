import type { Product } from 'src/product/entity/product.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import typeorm, { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @Column()
  idMl: string;
  @Column()
  url: string;
  @ManyToOne('Product', (product: Product) => product.images)
  product: typeorm.Relation<Product>;

  constructor(idMl: string, url: string) {
    super();
    this.idMl = idMl;
    this.url = url;
  }
}
