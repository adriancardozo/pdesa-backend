import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminMetricsService } from 'src/admin-metrics/admin-metrics.service';
import { ProductService } from 'src/product/product.service';
import configuration from 'src/config/configuration';
import {
  productIds,
  productRelations,
  products,
  userIds,
  userRelations,
  users,
} from './test-data/admin-metrics.service.spec.data';
import { UserService } from 'src/user/user.service';

describe('AdminMetricsService', () => {
  let user: jest.Mocked<User>;
  let module: TestingModule;
  let transactionService: TransactionService;
  let manager: jest.Mocked<EntityManager>;
  let productService: jest.Mocked<ProductService>;
  let userService: jest.Mocked<UserService>;
  let service: AdminMetricsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), TransactionModule],
      providers: [AdminMetricsService],
    })
      .useMocker(mock)
      .compile();

    user = mock(User);
    manager = mock(EntityManager);
    transactionService = module.get<TransactionService>(TransactionService);
    productService = module.get<jest.Mocked<ProductService>>(ProductService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
    service = module.get<AdminMetricsService>(AdminMetricsService);
    const repository = mock(Repository);
    const queryBuilder = mock(SelectQueryBuilder);
    manager.getRepository.mockReturnValue(repository);
    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.groupBy.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.limit.mockReturnValue(queryBuilder);
    queryBuilder.execute.mockResolvedValue(productIds);
  });

  describe('Top five favorited', () => {
    beforeEach(() => {
      productService.findProductsByIds.mockResolvedValue(products);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.top5Favorited(user, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should get top five favorited products', async () => {
      await service.top5Favorited(user, manager);
      expect(productService.findProductsByIds).toHaveBeenCalledWith(productIds, productRelations, manager);
    });

    it('should return top five favorited products', async () => {
      const result = await service.top5Favorited(user, manager);
      expect(result).toEqual(products);
    });
  });

  describe('Top five purchased', () => {
    beforeEach(() => {
      productService.findProductsByIds.mockResolvedValue(products);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.top5Purchased(user, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should get top five purchased products', async () => {
      await service.top5Purchased(user, manager);
      expect(productService.findProductsByIds).toHaveBeenCalledWith(productIds, productRelations, manager);
    });

    it('should return top five purchased products', async () => {
      const result = await service.top5Purchased(user, manager);
      expect(result).toEqual(products);
    });
  });

  describe('Top five purchaser', () => {
    beforeEach(() => {
      userService.findUsersByIds.mockResolvedValue(users);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.top5Purchaser(user, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should get top five purchasers', async () => {
      await service.top5Purchaser(user, manager);
      expect(userService.findUsersByIds).toHaveBeenCalledWith(userIds, userRelations, manager);
    });

    it('should return top five purchasers', async () => {
      const result = await service.top5Purchaser(user, manager);
      expect(result).toEqual(users);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
