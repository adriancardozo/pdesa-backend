import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from 'src/config/configuration';
import { Product } from 'src/product/entity/product.entity';
import { ProductService } from 'src/product/product.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager } from 'typeorm';
import {
  idMl,
  emptyMercadoLibreProductsIds,
  mercadoLibreProductsIds,
  emptyIds,
  ids,
  mergedProducts,
  mlProduct,
  product,
  q,
  relations,
  searchResult,
  user,
  products,
  emptyProducts,
} from './test-data/product.service.spec.data';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';
import { MercadoLibreProductAdapter } from 'src/product/adapter/mercado-libre-product.adapter';
import { mockPropertyValue } from 'test/resources/mocks/mock-property-value';

jest.mock('src/product/adapter/mercado-libre-product.adapter');

describe('ProductService', () => {
  let module: TestingModule;
  let service: ProductService;
  let transactionService: TransactionService;
  let mercadoLibreProductService: jest.Mocked<MercadoLibreProductService>;
  let manager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ProductService],
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), TransactionModule],
    })
      .useMocker(mock)
      .compile();

    manager = mock(EntityManager);
    service = module.get<ProductService>(ProductService);
    transactionService = module.get<TransactionService>(TransactionService);
    mercadoLibreProductService =
      module.get<jest.Mocked<MercadoLibreProductService>>(MercadoLibreProductService);
  });

  describe('Search', () => {
    let products: Array<jest.Mocked<Product>>;
    let adapter: jest.Mocked<MercadoLibreProductAdapter>;

    beforeEach(() => {
      products = [1, 2].map(() => mock(Product));
      mercadoLibreProductService.search.mockResolvedValue(searchResult);
      manager.find.mockResolvedValue(products);
      adapter = mock(MercadoLibreProductAdapter);
      mockPropertyValue(adapter, 'ids', mercadoLibreProductsIds);
      adapter.products.mockReturnValue(mergedProducts);
      (MercadoLibreProductAdapter as jest.Mock).mockReturnValue(adapter);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.search(q, user, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should search Mercado Libre products', async () => {
      await service.search(q, user, manager);
      expect(mercadoLibreProductService.search).toHaveBeenCalledWith(q);
    });

    it('should find already saved products', async () => {
      await service.search(q, user, manager);
      expect(manager.find).toHaveBeenCalledWith(Product, { where: mercadoLibreProductsIds, relations });
    });

    it("should not find already saved products if there aren't Mercado Libre products", async () => {
      mockPropertyValue(adapter, 'ids', emptyMercadoLibreProductsIds);
      await service.search(q, user, manager);
      expect(manager.find).toHaveBeenCalledTimes(0);
    });

    it('should merge Mercado Libre products and saved products', async () => {
      await service.search(q, user, manager);
      expect(adapter.products).toHaveBeenCalledWith(products);
    });

    it('should return merged products', async () => {
      const result = await service.search(q, user, manager);
      expect(result).toEqual(mergedProducts);
    });
  });

  describe('Product', () => {
    let product: jest.Mocked<Product>;
    let foundProduct: jest.Mocked<Product>;
    let adapter: jest.Mocked<MercadoLibreProductAdapter>;

    beforeEach(() => {
      product = mock(Product);
      foundProduct = mock(Product);
      mercadoLibreProductService.getProduct.mockResolvedValue(mlProduct);
      adapter = mock(MercadoLibreProductAdapter);
      adapter.products.mockReturnValue([product]);
      (MercadoLibreProductAdapter as jest.Mock).mockReturnValue(adapter);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.product(idMl, user, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should get Mercado Libre product', async () => {
      await service.product(idMl, user, manager);
      expect(mercadoLibreProductService.getProduct).toHaveBeenCalledWith(idMl);
    });

    it('should find product', async () => {
      await service.product(idMl, user, manager);
      expect(manager.findOne).toHaveBeenCalledWith(Product, { where: { idMl }, relations });
    });

    it('should adapt product', async () => {
      await service.product(idMl, user, manager);
      expect(adapter.products).toHaveBeenCalledWith([]);
    });

    it('should return product', async () => {
      const result = await service.product(idMl, user, manager);
      expect(result).toEqual(product);
    });

    describe('If product exists', () => {
      beforeEach(() => {
        manager.findOne.mockResolvedValue(foundProduct);
      });

      it('should adapt found product', async () => {
        await service.product(idMl, user, manager);
        expect(adapter.products).toHaveBeenCalledWith([foundProduct]);
      });
    });
  });

  describe('Get or create product', () => {
    beforeEach(() => {
      manager.findOne.mockResolvedValue(product);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.getOrCreateProduct(idMl, relations, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find product by MercadoLibre id', async () => {
      await service.getOrCreateProduct(idMl, relations, manager);
      expect(manager.findOne).toHaveBeenCalledWith(Product, { where: { idMl }, relations });
    });

    it('should return found product', async () => {
      const result = await service.getOrCreateProduct(idMl, relations, manager);
      expect(result).toEqual(product);
    });

    describe('If product not exists', () => {
      beforeEach(() => {
        manager.findOne.mockResolvedValue(null);
        manager.save.mockResolvedValue(mlProduct.product);
        mercadoLibreProductService.getProduct.mockResolvedValue(mlProduct);
      });

      it('should get product from MercadoLibre API', async () => {
        await service.getOrCreateProduct(idMl, relations, manager);
        expect(mercadoLibreProductService.getProduct).toHaveBeenCalledWith(idMl);
      });

      it('should save application product created from MercadoLibre API product', async () => {
        await service.getOrCreateProduct(idMl, relations, manager);
        expect(manager.save).toHaveBeenCalledWith(mlProduct.product);
      });

      it('should return created product', async () => {
        const result = await service.getOrCreateProduct(idMl, relations, manager);
        expect(result).toEqual(mlProduct.product);
      });
    });
  });

  describe('Find product by MercadoLibre id ', () => {
    beforeEach(() => {
      manager.findOne.mockResolvedValue(product);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findProductByIdMl(idMl, relations, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find product by MercadoLibre id', async () => {
      await service.findProductByIdMl(idMl, relations, manager);
      expect(manager.findOne).toHaveBeenCalledWith(Product, { where: { idMl }, relations });
    });

    it('should return found product', async () => {
      const result = await service.findProductByIdMl(idMl, relations, manager);
      expect(result).toEqual(product);
    });
  });

  describe('Find products by MercadoLibre ids ', () => {
    beforeEach(() => {
      manager.find.mockResolvedValue(products);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findProductsByIdsMl(mercadoLibreProductsIds, relations, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it("should not find products by MercadoLibre ids if there aren't ids", async () => {
      await service.findProductsByIdsMl(emptyMercadoLibreProductsIds, relations, manager);
      expect(manager.find).toHaveBeenCalledTimes(0);
    });

    it("should return empty result if there aren't ids", async () => {
      const result = await service.findProductsByIdsMl(emptyMercadoLibreProductsIds, relations, manager);
      expect(result).toEqual(emptyProducts);
    });

    it('should find products by MercadoLibre ids', async () => {
      await service.findProductsByIdsMl(mercadoLibreProductsIds, relations, manager);
      expect(manager.find).toHaveBeenCalledWith(Product, { where: mercadoLibreProductsIds, relations });
    });

    it('should return found products', async () => {
      const result = await service.findProductsByIdsMl(mercadoLibreProductsIds, relations, manager);
      expect(result).toEqual(products);
    });
  });

  describe('Find products by ids ', () => {
    beforeEach(() => {
      manager.find.mockResolvedValue(products);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findProductsByIds(ids, relations, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it("should not find products ids if there aren't ids", async () => {
      await service.findProductsByIds(emptyIds, relations, manager);
      expect(manager.find).toHaveBeenCalledTimes(0);
    });

    it("should return empty result if there aren't ids", async () => {
      const result = await service.findProductsByIds(emptyIds, relations, manager);
      expect(result).toEqual(emptyProducts);
    });

    it('should find products by ids', async () => {
      await service.findProductsByIds(ids, relations, manager);
      expect(manager.find).toHaveBeenCalledWith(Product, { where: ids, relations });
    });

    it('should return found products', async () => {
      const result = await service.findProductsByIds(ids, relations, manager);
      expect(result).toEqual(products);
    });
  });

  describe('Create product', () => {
    beforeEach(() => {
      manager.save.mockResolvedValue(mlProduct.product);
      mercadoLibreProductService.getProduct.mockResolvedValue(mlProduct);
    });

    it('should get product from MercadoLibre API', async () => {
      await service.createProduct(idMl, manager);
      expect(mercadoLibreProductService.getProduct).toHaveBeenCalledWith(idMl);
    });

    it('should save application product created from MercadoLibre API product', async () => {
      await service.createProduct(idMl, manager);
      expect(manager.save).toHaveBeenCalledWith(mlProduct.product);
    });

    it('should return created product', async () => {
      const result = await service.createProduct(idMl, manager);
      expect(result).toEqual(mlProduct.product);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
    jest.resetAllMocks();
  });
});
