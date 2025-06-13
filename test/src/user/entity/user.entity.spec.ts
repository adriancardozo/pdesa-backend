import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/entity/product.entity';
import { mock } from 'test/resources/mocks/mock';
import { User } from 'src/user/entity/user.entity';
import {
  createdFavorite,
  deletedFavorite,
  errors,
  favorite,
  idMl,
  previouslyAddedFavorite,
  userJson,
  userWithAFavoriteJson,
} from './test-data/user.entity.spec.data';
import * as FavoriteEntity from 'src/favorite/entity/favorite.entity';

describe('User', () => {
  let user: User;
  let product: jest.Mocked<Product>;

  beforeEach(() => {
    user = plainToInstance(User, userJson);
    product = mock(Product);
  });

  describe('Add favorite', () => {
    let find: jest.SpyInstance;

    beforeEach(() => {
      find = jest.spyOn(Array.prototype, 'find');
      find.mockReturnValue(favorite);
    });

    it('should search for favorite', () => {
      user.addFavorite(product);
      expect(find).toHaveBeenCalled();
    });

    it('should return favorite', () => {
      const result = user.addFavorite(product);
      expect(result).toEqual(favorite);
    });

    describe('If favorite not exists', () => {
      let FavoriteClass: jest.SpyInstance;

      beforeEach(() => {
        find.mockReturnValue(null);
        FavoriteClass = jest.spyOn(FavoriteEntity, 'Favorite');
        FavoriteClass.mockReturnValue(createdFavorite);
      });

      it('should create favorite', () => {
        user.addFavorite(product);
        expect(FavoriteClass).toHaveBeenCalledWith(user, product);
      });

      it('should add favorite to user', () => {
        user.addFavorite(product);
        expect(user.favorites).toEqual([createdFavorite]);
      });

      it('should return created favorite', () => {
        const result = user.addFavorite(product);
        expect(result).toEqual(createdFavorite);
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('Delete favorite', () => {
    let find: jest.SpyInstance;

    beforeEach(() => {
      user = plainToInstance(User, userWithAFavoriteJson);
      find = jest.spyOn(Array.prototype, 'find');
      find.mockReturnValue(previouslyAddedFavorite);
    });

    it('should search for favorite', () => {
      user.deleteFavorite(idMl);
      expect(find).toHaveBeenCalled();
    });

    it('should delete favorite', () => {
      user.deleteFavorite(idMl);
      expect(user.favorites).toEqual([]);
    });

    it('should return deleted favorite', () => {
      const result = user.deleteFavorite(idMl);
      expect(result).toEqual(deletedFavorite);
    });

    describe('If favorite not exists', () => {
      beforeEach(() => {
        find.mockReturnValue(null);
      });

      it('should throw favorite not found error', () => {
        expect(() => user.deleteFavorite(idMl)).toThrow(new NotFoundException(errors.favoriteNotFound));
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('Get favorite', () => {
    let find: jest.SpyInstance;

    beforeEach(() => {
      user = plainToInstance(User, userWithAFavoriteJson);
      find = jest.spyOn(Array.prototype, 'find');
      find.mockReturnValue(previouslyAddedFavorite);
    });

    it('should search for favorite', () => {
      user.getFavorite(idMl);
      expect(find).toHaveBeenCalled();
    });

    it('should return found favorite', () => {
      const result = user.getFavorite(idMl);
      expect(result).toEqual(previouslyAddedFavorite);
    });

    describe('If favorite not exists', () => {
      beforeEach(() => {
        find.mockReturnValue(null);
      });

      it('should throw favorite not found error', () => {
        expect(() => user.getFavorite(idMl)).toThrow(new NotFoundException(errors.favoriteNotFound));
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
