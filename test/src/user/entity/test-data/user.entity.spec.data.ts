import configuration from 'src/config/configuration';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Role } from 'src/user/enum/role.enum';

export const userJson = {
  id: '1',
  username: 'user1',
  password: 'password1',
  role: Role.purchaser,
  firstName: 'User1',
  lastName: 'USer1',
  email: 'user1@email.com',
  dni: '11111111',
  favorites: [],
  purchases: [],
};

export const amount = 1;

export const previouslyAddedFavorite = { id: '2', idMl: 'MLA2222222' } as Favorite;

export const idMl = previouslyAddedFavorite.idMl;

export const deletedFavorite = previouslyAddedFavorite;

export const errors = configuration().error.message;

export const userWithAFavoriteJson = {
  id: '1',
  username: 'user1',
  password: 'password1',
  role: Role.purchaser,
  firstName: 'User1',
  lastName: 'USer1',
  email: 'user1@email.com',
  dni: '11111111',
  favorites: [previouslyAddedFavorite],
  purchases: [],
};
