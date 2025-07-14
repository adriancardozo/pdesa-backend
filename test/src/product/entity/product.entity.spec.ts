import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { Product } from 'src/product/entity/product.entity';
import {
  errors,
  productJson,
  productWithoutFavoritesAttributeJson,
  productWithoutFavoritesJson,
  productWithoutQueryUserJson,
  user,
  favorites,
  amount,
} from './test-data/product.entity.spec.data';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { mock } from 'test/resources/mocks/mock';

describe('Product', () => {
  let product: Product;
  let productWithoutFavorites: Product;
  let productWithoutFavoritesAttribute: Product;
  let productWithoutQueryUser: Product;

  beforeEach(() => {
    product = plainToInstance(Product, productJson);
    productWithoutFavorites = plainToInstance(Product, productWithoutFavoritesJson);
    productWithoutFavoritesAttribute = plainToInstance(Product, productWithoutFavoritesAttributeJson);
    productWithoutQueryUser = plainToInstance(Product, productWithoutQueryUserJson);
  });

  describe('Is favorite', () => {
    it('should fail if query user is not setted', () => {
      expect(() => productWithoutQueryUser.isFavorite).toThrow(
        new BadRequestException(errors.notQueryUser),
      );
    });

    it("should return true if it is query user's favorite", () => {
      const result = product.isFavorite;
      expect(result).toBeTruthy();
    });

    it("should return false if it isn't query user's favorite", () => {
      const result = productWithoutFavorites.isFavorite;
      expect(result).toBeFalsy();
    });

    it("should return false if product hasn't favorites", () => {
      const result = productWithoutFavoritesAttribute.isFavorite;
      expect(result).toBeFalsy();
    });
  });

  describe('Set query user', () => {
    it('should set query user', () => {
      productWithoutQueryUser.setQueryUser(user);
      expect(productWithoutQueryUser.queryUser).toEqual(user);
    });
  });

  describe('Amount purchases', () => {
    let purchase: jest.Mocked<Purchase>;

    beforeEach(() => {
      purchase = mock(Purchase);
      product.purchases = [purchase];
      purchase.amount = amount;
    });

    it('should return purchases amount sum', () => {
      const result = product.amountPurchases;
      expect(result).toEqual(purchase.amount);
    });
  });

  describe('Amount favorites', () => {
    it('should return favorites count', () => {
      const result = product.amountFavorites;
      expect(result).toEqual(favorites.length);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
