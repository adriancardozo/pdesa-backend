import { IdMlDto } from 'src/favorite/dto/id-ml.dto';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { FindOneOptions } from 'typeorm';

export const configuration = () => ({});

export const userDto = { id: '1' } as User;

export const product = { id: '2', idMl: 'MLA2222222' } as Product;

export const deletedFavorite = { id: product.idMl, productId: product.id, userId: userDto.id } as Favorite;

export const createdFavorite = { id: product.idMl, productId: product.id, userId: userDto.id } as Favorite;

export const favorite = { id: 'MLA1111111', productId: '1', userId: '1' } as Favorite;

export const favorites = [favorite] as Favorite[];

export const user = { id: '1', favorites } as User;

export const userRelations = {
  favorites: { product: { images: true } },
} as FindOneOptions<User>['relations'];

export const idMlDto = { idMl: 'MLA1111111' } as IdMlDto;

export const productRelations = { images: true } as FindOneOptions<Product>['relations'];
