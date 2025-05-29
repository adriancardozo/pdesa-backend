import { MercadoLibreProduct } from 'src/mercado-libre/entity/mercado-libre-product.entity';
import { Product } from 'src/product/entity/product.entity';
import { FindOneOptions } from 'typeorm';

export const idMl = 'MLA1111111';

export const product = { idMl, name: 'ml product 1' } as Product;

export const mlProduct = {
  id: idMl,
  name: product.name,
  product,
} as MercadoLibreProduct;

export const relations = { images: true } as FindOneOptions<Product>['relations'];
