import { MercadoLibreProduct } from 'src/mercado-libre/entity/mercado-libre-product.entity';
import { MercadoLibreSearchResult } from 'src/mercado-libre/entity/mercado-libre-search-result.entity';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { FindOneOptions } from 'typeorm';

export const idMl = 'MLA1111111';

export const product = { idMl, name: 'ml product 1' } as Product;

export const mlProduct = {
  id: idMl,
  name: product.name,
  product,
} as MercadoLibreProduct;

export const relations = { images: true, favorites: true } as FindOneOptions<Product>['relations'];

export const searchResult = {
  results: [
    { id: 'ML111111' },
    { id: 'ML222222' },
    { id: 'ML333333' },
    { id: 'ML444444' },
  ] as Array<MercadoLibreProduct>,
} as MercadoLibreSearchResult;

export const emptySearchResult = { results: [] as Array<MercadoLibreProduct> } as MercadoLibreSearchResult;

export const products = [
  { id: '1', idMl: 'ML111111' },
  { id: '2', idMl: 'ML222222' },
] as Array<Product>;

export const emptyProducts = [] as Array<Product>;

export const mergedProducts = [
  { id: '1', idMl: 'ML111111' },
  { id: '2', idMl: 'ML222222' },
  { idMl: 'ML333333' },
  { idMl: 'ML444444' },
] as Array<Product>;

export const mercadoLibreProductsIds = searchResult.results.map((product) => ({ idMl: product.id }));

export const emptyMercadoLibreProductsIds = [];

export const user = { id: '1' } as User;

export const q = 'product query';
