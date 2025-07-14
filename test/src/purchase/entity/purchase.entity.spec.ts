import { Product } from 'src/product/entity/product.entity';
import { mock } from 'test/resources/mocks/mock';
import { User } from 'src/user/entity/user.entity';
import { Purchase } from 'src/purchase/entity/purchase.entity';

describe('Purchase', () => {
  let purchase: Purchase;
  let user: jest.Mocked<User>;
  let product: jest.Mocked<Product>;
  const amount = 2;
  const price = 30;

  beforeEach(() => {
    user = mock(User);
    product = mock(Product);
    product.price = price;
    purchase = new Purchase(amount, user, product);
  });

  describe('Final price', () => {
    it('should return final price', () => {
      const result = purchase.finalPrice;
      expect(result).toEqual(amount * product.price);
    });
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
