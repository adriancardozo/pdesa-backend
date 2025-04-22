import type { Image } from 'src/image/entity/image.entity';

export class Product {
  id: string;
  idMl: string;
  name: string;
  mlCreatedAt: Date;
  description: string;
  keywords: string;
  images: Array<Image>;

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
