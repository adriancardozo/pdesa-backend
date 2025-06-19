import { BadRequestException } from '@nestjs/common';
import { Configuration } from 'src/config/configuration';
import type { Product } from 'src/product/entity/product.entity';
import { Review } from 'src/review/entity/review.entity';
import { CONFIG_SERVICE } from 'src/shared/config/config.service';
import { BaseEntity } from 'src/shared/entity/base.entity';
import type { User } from 'src/user/entity/user.entity';
import typeorm, { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

const errors = CONFIG_SERVICE.get<Configuration['error']['message']>('error.message')!;

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

  queryUser: User;

  get idMl(): string {
    return this.product.idMl;
  }

  get isFavorite(): boolean {
    if (!this.queryUser) throw new BadRequestException(errors.notQueryUser);
    return this.queryUser.favorites?.some((favorite) => favorite.idMl === this.idMl) ?? false;
  }

  constructor(user: User, product: Product) {
    super();
    this.user = user;
    this.product = product;
  }

  setQueryUser(user: User) {
    this.queryUser = user;
  }
}
