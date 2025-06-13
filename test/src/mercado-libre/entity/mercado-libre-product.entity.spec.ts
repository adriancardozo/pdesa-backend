import { MercadoLibreProduct } from 'src/mercado-libre/entity/mercado-libre-product.entity';
import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/entity/product.entity';
import {
  errors,
  imagesJson,
  mlInactiveProductJson,
  mlProductJson,
  picturesJson,
  productJson,
} from './test-data/mercado-libre-product.entity.data';
import { mock } from 'test/resources/mocks/mock';
import { MercadoLibreProductPicture } from 'src/mercado-libre/entity/mercado-libre-product-picture.entity';

describe('MercadoLibreProduct', () => {
  let mlProduct: MercadoLibreProduct;
  let mlInactiveProduct: MercadoLibreProduct;
  let product: Product;
  let pictures: Array<jest.Mocked<MercadoLibreProductPicture>>;

  function generatePictures() {
    return picturesJson
      .map(() => mock(MercadoLibreProductPicture))
      .map((picture, index) =>
        Object.defineProperty(picture, 'image', {
          get: jest.fn().mockReturnValue(imagesJson[index]),
          configurable: true,
        }),
      );
  }

  beforeEach(() => {
    mlProduct = plainToInstance(MercadoLibreProduct, mlProductJson);
    pictures = generatePictures();
    mlProduct.pictures = pictures;
    mlInactiveProduct = plainToInstance(MercadoLibreProduct, mlInactiveProductJson);
    product = plainToInstance(Product, productJson);
  });

  describe('product', () => {
    it('should return product with Mercado Libre product information', () => {
      expect(mlProduct.product).toMatchObject(product);
    });

    it('should cerate images from Mercado Libre pictures', () => {
      const spies = pictures.map((picture) => jest.spyOn(picture, 'image', 'get'));
      mlProduct.product;
      spies.forEach((spy) => expect(spy).toHaveBeenCalled());
    });

    it('should set created images into Product images', () => {
      expect(mlProduct.product.images).toMatchObject(imagesJson);
    });

    it('should fail if product is inactive', () => {
      expect(() => mlInactiveProduct.product).toThrow(NotFoundException);
    });

    it('should fail with message if product is inactive', () => {
      expect(() => mlInactiveProduct.product).toThrow(errors.inactiveProduct);
    });
  });
});
