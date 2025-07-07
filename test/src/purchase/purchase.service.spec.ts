import { Test, TestingModule } from '@nestjs/testing';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { PurchaseService } from 'src/purchase/purchase.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager } from 'typeorm';
import {
  amount,
  idMlDto,
  productRelations,
  purchaseDto,
  userRelations,
} from './test-data/purchase.service.spec.data';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { Product } from 'src/product/entity/product.entity';
import { TransactionModule } from 'src/transaction/transaction.module';

describe('PurchaseService', () => {
  let module: TestingModule;
  let service: PurchaseService;
  let transactionService: TransactionService;
  let manager: jest.Mocked<EntityManager>;
  let productService: jest.Mocked<ProductService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PurchaseService],
      imports: [TransactionModule],
    })
      .useMocker(mock)
      .compile();

    manager = mock(EntityManager);
    service = module.get<PurchaseService>(PurchaseService);
    transactionService = module.get<TransactionService>(TransactionService);
    productService = module.get<jest.Mocked<ProductService>>(ProductService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
  });

  describe('Purchase', () => {
    let purchase: Purchase;
    let user: jest.Mocked<User>;
    let product: jest.Mocked<Product>;

    beforeEach(() => {
      user = mock(User);
      product = mock(Product);
      purchase = new Purchase(amount, user, product);
      user.purchase.mockReturnValue(purchase);
      userService.findOneById.mockResolvedValue(user);
      productService.getOrCreateProduct.mockResolvedValue(product);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should get or create product', async () => {
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(productService.getOrCreateProduct).toHaveBeenCalledWith(
        idMlDto.idMl,
        productRelations,
        manager,
      );
    });

    it('should get user', async () => {
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(user.id, userRelations, manager);
    });

    it('should purchase product', async () => {
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(user.purchase).toHaveBeenCalledWith(product, amount);
    });

    it('should purchase product', async () => {
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(user.purchase).toHaveBeenCalledWith(product, amount);
    });

    it('should save purchases', async () => {
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(manager.save).toHaveBeenCalledWith(user);
    });

    it('should set product query user', async () => {
      await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(product.setQueryUser).toHaveBeenCalledWith(user);
    });

    it('should return created purchase', async () => {
      const result = await service.purchase(idMlDto, purchaseDto, user, manager);
      expect(result).toEqual(purchase);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
