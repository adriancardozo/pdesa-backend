import { Favorite } from 'src/favorite/entity/favorite.entity';
import { product, user } from '../test-data/favorite.service.spec.data';

describe('Favorite', () => {
  let favorite: Favorite;

  beforeEach(() => {
    favorite = new Favorite(user, product);
  });

  describe('Id ML', () => {
    it('should return Mercado Libre product id', () => {
      expect(favorite.idMl).toEqual(product.idMl);
    });
  });
});
