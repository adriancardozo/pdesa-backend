import { BadRequestException } from '@nestjs/common';
import { Configuration } from 'src/config/configuration';
import type { Favorite } from 'src/favorite/entity/favorite.entity';
import type { Image } from 'src/image/entity/image.entity';
import type { Purchase } from 'src/purchase/entity/purchase.entity';
import { CONFIG_SERVICE } from 'src/shared/config/config.service';
import { BaseEntity } from 'src/shared/entity/base.entity';
import type { User } from 'src/user/entity/user.entity';
import typeorm, { Column, Entity, OneToMany } from 'typeorm';

const errors = CONFIG_SERVICE.get<Configuration['error']['message']>('error.message')!;

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

  price: number = 25;

  queryUser: User;

  get isFavorite(): boolean {
    if (!this.queryUser) throw new BadRequestException(errors.notQueryUser);
    return this.favorites?.some((favorite) => favorite.userId === this.queryUser.id) ?? false;
  }

  get amountFavorites(): number {
    return this.favorites.length;
  }

  get amountPurchases(): number {
    return this.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  }

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

  setQueryUser(user: User): Product {
    this.queryUser = user;
    return this;
  }
}
