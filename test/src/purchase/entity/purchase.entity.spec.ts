import { Product } from 'src/product/entity/product.entity';
import { mock } from 'test/resources/mocks/mock';
import { User } from 'src/user/entity/user.entity';
import { Purchase } from 'src/purchase/entity/purchase.entity';

describe('Purchase', () => {
  let purchase: Purchase;
  let user: jest.Mocked<User>;
  let product: jest.Mocked<Product>;

  beforeEach(() => {
    user = mock(User);
    product = mock(Product);
    purchase = new Purchase(1, user, product);
  });

  describe('Set query user', () => {
    it('should set product query user', () => {
      purchase.setQueryUser(user);
      expect(product.setQueryUser).toHaveBeenCalledWith(user);
    });

    it('should return purchase', () => {
      const result = purchase.setQueryUser(user);
      expect(result).toEqual(purchase);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
