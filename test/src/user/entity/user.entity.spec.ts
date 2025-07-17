import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/entity/product.entity';
import { mock } from 'test/resources/mocks/mock';
import { User } from 'src/user/entity/user.entity';
import {
  deletedFavorite,
  errors,
  idMl,
  previouslyAddedFavorite,
  userJson,
  userWithAFavoriteJson,
  amount,
  purchaseId,
} from './test-data/user.entity.spec.data';
import * as FavoriteEntity from 'src/favorite/entity/favorite.entity';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import * as PurchaseEntity from 'src/purchase/entity/purchase.entity';
import { Purchase } from 'src/purchase/entity/purchase.entity';

describe('User', () => {
  let user: User;
  let product: jest.Mocked<Product>;
  let favorite: jest.Mocked<Favorite>;
  let purchase: jest.Mocked<Purchase>;
  let createdFavorite: jest.Mocked<Favorite>;

  beforeEach(() => {
    user = plainToInstance(User, userJson);
    product = mock(Product);
    favorite = mock(Favorite);
    purchase = mock(Purchase);
    createdFavorite = mock(Favorite);
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

      afterEach(() => {
        FavoriteClass.mockRestore();
        find.mockRestore();
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      find.mockRestore();
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
      find.mockRestore();
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
      find.mockRestore();
    });
  });

  describe('Set query user', () => {
    let FavoriteClass: jest.SpyInstance;
    let favorite: Favorite;
    beforeEach(() => {
      favorite = { setQueryUser: jest.fn() } as never as Favorite;
      FavoriteClass = jest.spyOn(FavoriteEntity, 'Favorite');
      FavoriteClass.mockReturnValue(favorite);
      user.addFavorite(product);
    });

    it('should set query user', () => {
      user.setQueryUser(user);
      expect(user.queryUser).toEqual(user);
    });

    it("should set user's favorites query user", () => {
      user.setQueryUser(user);
      expect(favorite.setQueryUser).toHaveBeenCalledWith(user);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('Amount purchases', () => {
    let PurchaseClass: jest.SpyInstance;

    beforeEach(() => {
      PurchaseClass = jest.spyOn(PurchaseEntity, 'Purchase');
      PurchaseClass.mockReturnValue(purchase);
      user.purchase(product, amount);
    });

    it('should return purchases length', () => {
      const result = user.amountPurchases;
      expect(result).toEqual(user.purchases.length);
    });
  });

  describe('Purchase', () => {
    let PurchaseClass: jest.SpyInstance;

    beforeEach(() => {
      PurchaseClass = jest.spyOn(PurchaseEntity, 'Purchase');
      PurchaseClass.mockReturnValue(purchase);
    });

    it('should create purchase', () => {
      user.purchase(product, amount);
      expect(PurchaseClass).toHaveBeenCalledWith(amount, user, product);
    });

    it('should add purchase to user purchases', () => {
      user.purchase(product, amount);
      expect(user.purchases).toMatchObject([purchase]);
    });

    it('should return created purchase', () => {
      const result = user.purchase(product, amount);
      expect(result).toEqual(purchase);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('Get purchase', () => {
    describe('Exists', () => {
      beforeEach(() => {
        purchase.id = purchaseId;
        user.purchases = [purchase];
      });

      it('should return found purchase with id', () => {
        const result = user.getPurchase(purchaseId);
        expect(result).toEqual(purchase);
      });
    });

    describe('Not exists', () => {
      beforeEach(() => {
        purchase.id = purchaseId;
        user.purchases = [];
      });

      it('should fail if not found purchase', () => {
        expect(() => user.getPurchase(purchaseId)).toThrow(new NotFoundException(errors.purchaseNotFound));
      });
    });
  });
});
