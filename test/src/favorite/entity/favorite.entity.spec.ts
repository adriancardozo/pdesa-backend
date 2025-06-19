import { Favorite } from 'src/favorite/entity/favorite.entity';
import { errors, product } from './test-data/favorite.entity.spec.data';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';

describe('Favorite', () => {
  let favorite: Favorite;
  let favoriteWithoutQueryUser: Favorite;
  let user: jest.Mocked<User>;

  beforeEach(() => {
    user = mock(User);
    favorite = new Favorite(user, product);
    favorite.setQueryUser(user);
    favoriteWithoutQueryUser = new Favorite(user, product);
  });

  describe('Id ML', () => {
    it('should return Mercado Libre product id', () => {
      expect(favorite.idMl).toEqual(product.idMl);
    });
  });

  describe('Is favorite', () => {
    it('should fail if query user is not setted', () => {
      expect(() => favoriteWithoutQueryUser.isFavorite).toThrow(
        new BadRequestException(errors.notQueryUser),
      );
    });

    it("should return true if it is query user's favorite", () => {
      user.favorites = [favorite];
      const result = favorite.isFavorite;
      expect(result).toBeTruthy();
    });

    it("should return false if it isn't query user's favorite", () => {
      user.favorites = [];
      const result = favorite.isFavorite;
      expect(result).toBeFalsy();
    });
  });

  describe('Set query user', () => {
    it('should set query user', () => {
      favoriteWithoutQueryUser.setQueryUser(user);
      expect(favoriteWithoutQueryUser.queryUser).toEqual(user);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
