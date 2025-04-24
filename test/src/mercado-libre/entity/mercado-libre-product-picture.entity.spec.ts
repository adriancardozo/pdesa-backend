import { plainToInstance } from 'class-transformer';
import { MercadoLibreProductPicture } from 'src/mercado-libre/entity/mercado-libre-product-picture.entity';
import { Image } from 'src/image/entity/image.entity';
import {
  imageJson,
  mlProductPictureJson,
} from '../test-data/entity/mercado-libre-product-picture.entity.data';

describe('MercadoLibreProductPicture', () => {
  let mlProductPicture: MercadoLibreProductPicture;
  let image: Image;

  beforeEach(() => {
    mlProductPicture = plainToInstance(MercadoLibreProductPicture, mlProductPictureJson);
    image = plainToInstance(Image, imageJson);
  });

  describe('image', () => {
    it('should return image with Mercado Libre image information', () => {
      expect(mlProductPicture.image).toMatchObject(image);
    });
  });
});
