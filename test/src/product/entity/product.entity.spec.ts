import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { Product } from 'src/product/entity/product.entity';
import {
  errors,
  productJson,
  productWithoutFavoritesJson,
  productWithoutQueryUserJson,
  user,
} from './test-data/product.entity.spec.data';

describe('Product', () => {
  let product: Product;
  let productWithoutFavorites: Product;
  let productWithoutQueryUser: Product;

  beforeEach(() => {
    product = plainToInstance(Product, productJson);
    productWithoutFavorites = plainToInstance(Product, productWithoutFavoritesJson);
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
  });

  describe('Set query user', () => {
    it('should set query user', () => {
      productWithoutQueryUser.setQueryUser(user);
      expect(productWithoutQueryUser.queryUser).toEqual(user);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
