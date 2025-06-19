import configuration from 'src/config/configuration';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { User } from 'src/user/entity/user.entity';

export const errors = configuration().error.message;

export const user = { id: '1' } as User;

export const favorites = [
  { id: '1', idMl: 'ML111111', userId: user.id },
  { id: '3', idMl: 'ML333333', userId: user.id },
] as Array<Favorite>;

export const productJson = {
  id: '1',
  name: 'product1',
  description: 'product1',
  favorites,
  idMl: favorites[0].idMl,
  queryUser: user,
};

export const productWithoutFavoritesJson = {
  id: '2',
  name: 'product2',
  description: 'product2',
  favorites: [],
  idMl: 'ML222222',
  queryUser: user,
};

export const productWithoutFavoritesAttributeJson = {
  id: '2',
  name: 'product2',
  description: 'product2',
  idMl: 'ML222222',
  queryUser: user,
};

export const productWithoutQueryUserJson = {
  id: '3',
  name: 'product3',
  description: 'product3',
  favorites,
  idMl: favorites[1].idMl,
};
