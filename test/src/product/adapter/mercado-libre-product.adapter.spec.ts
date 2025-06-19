import { MercadoLibreProduct } from 'src/mercado-libre/entity/mercado-libre-product.entity';
import { MercadoLibreProductAdapter } from 'src/product/adapter/mercado-libre-product.adapter';
import { Product } from 'src/product/entity/product.entity';
import { IdMl } from 'src/product/type/id-ml.type';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';
import { mockPropertyValue } from 'test/resources/mocks/mock-property-value';

describe('MercadoLibreProductAdapter', () => {
  let adapter: MercadoLibreProductAdapter;
  let mercadoLibreProducts: Array<jest.Mocked<MercadoLibreProduct>>;
  let notEntityMercadoLibreProducts: Array<jest.Mocked<MercadoLibreProduct>>;
  let user: jest.Mocked<User>;
  let mercadoLibreProductsIds: Array<IdMl>;
  let products: Array<jest.Mocked<Product>>;
  let mergedProducts: Array<Product>;

  beforeEach(() => {
    mercadoLibreProducts = [1, 2, 3, 4].map(() => mock(MercadoLibreProduct));
    mercadoLibreProducts.forEach((product, i) => (product.id = `ML${i}${i}${i}${i}${i}${i}`));
    mercadoLibreProducts.forEach((product) => {
      const mocked = mock(Product);
      mocked.idMl = product.id;
      mockPropertyValue(product, 'product', mocked);
    });
    mercadoLibreProductsIds = mercadoLibreProducts.map((product) => ({ idMl: product.id }));
    products = [1, 2].map(() => mock(Product));
    products.forEach((product, i) => (product.idMl = `ML${i}${i}${i}${i}${i}${i}`));
    notEntityMercadoLibreProducts = mercadoLibreProducts.slice(products.length);
    mergedProducts = [...products, ...notEntityMercadoLibreProducts.map((mlProduct) => mlProduct.product)];
    user = mock(User);
    adapter = new MercadoLibreProductAdapter(mercadoLibreProducts, user);
  });

  describe('IDs', () => {
    it('should get Mercado Libre products ids', () => {
      const result = adapter.ids;
      expect(result).toEqual(mercadoLibreProductsIds);
    });
  });

  describe('Products', () => {
    it('should set merged products query user', () => {
      adapter.products(products);
      mergedProducts.forEach((mergedProduct) => expect(mergedProduct.setQueryUser).toHaveBeenCalled());
    });

    it('should retrun merged Mercado Libre products and product entities', () => {
      const result = adapter.products(products);
      expect(result).toEqual(mergedProducts);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
