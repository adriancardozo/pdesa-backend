import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from 'src/config/configuration';
import { Product } from 'src/product/entity/product.entity';
import { ProductService } from 'src/product/product.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager } from 'typeorm';
import { idMl, mlProduct, product, relations } from './test-data/product.service.spce.data';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';

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

  afterEach(async () => await module.close());
});
