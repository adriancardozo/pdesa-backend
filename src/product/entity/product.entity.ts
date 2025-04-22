import type { Favorite } from 'src/favorite/entity/favorite.entity';
import type { Image } from 'src/image/entity/image.entity';
import type { Purchase } from 'src/purchase/entity/purchase.entity';

export class Product {
  id: string;
  idMl: string;
  name: string;
  mlCreatedAt: Date;
  description: string;
  keywords: string;
  images: Array<Image>;
  purchases: Array<Purchase>;
  favorites: Array<Favorite>;

  constructor(
    idMl: string,
    name: string,
    mlCreatedAt: Date,
    description: string,
    keywords: string,
    images: Array<Image>,
  ) {
    this.idMl = idMl;
    this.name = name;
    this.mlCreatedAt = mlCreatedAt;
    this.description = description;
    this.keywords = keywords;
    this.images = images;
  }
}
