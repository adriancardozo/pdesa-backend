import { IdMlDto } from 'src/favorite/dto/id-ml.dto';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { FindOneOptions } from 'typeorm';

export const configuration = () => ({});

export const userDto = { id: '1' } as User;

export const product = { id: '2', idMl: 'MLA2222222' } as Product;

export const userRelations = {
  favorites: { product: { images: true } },
} as FindOneOptions<User>['relations'];

export const idMlDto = { idMl: 'MLA1111111' } as IdMlDto;

export const productRelations = { images: true } as FindOneOptions<Product>['relations'];
