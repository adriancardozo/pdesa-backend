import { Favorite } from 'src/favorite/entity/favorite.entity';
import type { Purchase } from 'src/purchase/entity/purchase.entity';
import { Role } from '../enum/role.enum';
import typeorm, { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Product } from 'src/product/entity/product.entity';

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

  addFavorite(product: Product): Favorite {
    const favorite = this.findFavorite(product.idMl) ?? new Favorite(this, product);
    this.favorites.push(favorite);
    return favorite;
  }

  protected findFavorite(idMl: string): Favorite | null {
    return this.favorites.find((favorite) => favorite.idMl === idMl) ?? null;
  }
}
