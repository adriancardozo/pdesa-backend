import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { Role } from '../enum/role.enum';
import typeorm, { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entity/base.entity';
import type { Product } from 'src/product/entity/product.entity';
import { NotFoundException } from '@nestjs/common';
import { Configuration } from 'src/config/configuration';
import { CONFIG_SERVICE } from 'src/shared/config/config.service';

const errors: Configuration['error']['message'] = CONFIG_SERVICE.get('error.message')!;

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'nvarchar', default: Role.administrator })
  role: Role;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  dni: string;
  @OneToMany('Favorite', (favorite: Favorite) => favorite.user, { cascade: true })
  favorites: Array<typeorm.Relation<Favorite>>;
  @OneToMany('Purchase', (purchase: Purchase) => purchase.user, { cascade: true })
  purchases: Array<typeorm.Relation<Purchase>>;

  queryUser: User;

  get amountPurchases(): number {
    return this.purchases.length;
  }

  addFavorite(product: Product): Favorite {
    let favorite = this.findFavorite(product.idMl);
    if (!favorite) {
      favorite = new Favorite(this, product);
      this.favorites.push(favorite);
    }
    return favorite;
  }

  deleteFavorite(idMl: string): Favorite {
    const favorite = this.getFavorite(idMl);
    this.favorites = this.favorites.filter((favorite) => favorite.idMl !== idMl);
    return favorite;
  }

  getFavorite(idMl: string): Favorite {
    const favorite = this.findFavorite(idMl);
    if (!favorite) throw new NotFoundException(errors.favoriteNotFound);
    return favorite;
  }

  purchase(product: Product, amount: number): Purchase {
    const purchase = new Purchase(amount, this, product);
    this.purchases.push(purchase);
    return purchase;
  }

  getPurchase(id: string): Purchase {
    const purchase = this.findPurchase(id);
    if (!purchase) throw new NotFoundException(errors.purchaseNotFound);
    return purchase;
  }

  setQueryUser(user: User): User {
    this.queryUser = user;
    this.favorites?.forEach((favorite) => favorite.setQueryUser(user));
    this.purchases?.forEach((purchase) => purchase.setQueryUser(user));
    return this;
  }

  protected findPurchase(id: string): Purchase | null {
    return this.purchases.find((purchase) => purchase.id === id) ?? null;
  }

  protected findFavorite(idMl: string): Favorite | null {
    return this.favorites.find((favorite) => favorite.idMl === idMl) ?? null;
  }
}
