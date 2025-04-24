import type { Favorite } from 'src/favorite/entity/favorite.entity';
import type { Image } from 'src/image/entity/image.entity';
import type { Purchase } from 'src/purchase/entity/purchase.entity';
import { BaseEntity } from 'src/shared/entity/base.entity';
import typeorm, { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column()
  idMl: string;
  @Column()
  name: string;
  @Column({ type: 'datetime' })
  mlCreatedAt: Date;
  @Column()
  description: string;
  @Column()
  keywords: string;
  @OneToMany('Image', (image: Image) => image.product, { cascade: true })
  images: Array<typeorm.Relation<Image>>;
  @OneToMany('Purchase', (purchase: Purchase) => purchase.product, { cascade: true })
  purchases: Array<typeorm.Relation<Purchase>>;
  @OneToMany('Favorite', (favorite: Favorite) => favorite.product, { cascade: true })
  favorites: Array<typeorm.Relation<Favorite>>;

  constructor(
    idMl: string,
    name: string,
    mlCreatedAt: Date,
    description: string,
    keywords: string,
    images: Array<Image>,
  ) {
    super();
    this.idMl = idMl;
    this.name = name;
    this.mlCreatedAt = mlCreatedAt;
    this.description = description;
    this.keywords = keywords;
    this.images = images;
  }
}
