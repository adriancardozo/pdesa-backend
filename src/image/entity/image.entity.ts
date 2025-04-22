import type { Product } from 'src/product/entity/product.entity';

export class Image {
  id: string;
  idMl: string;
  url: string;
  product: Product;

  constructor(idMl: string, url: string) {
    this.idMl = idMl;
    this.url = url;
  }
}
