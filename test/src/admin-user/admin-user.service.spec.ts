import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { id } from './test-data/admin-user.service.spec.data';
import { UserService } from 'src/user/user.service';
import { AdminUserService } from 'src/admin-user/admin-user.service';
import { FavoriteService } from 'src/favorite/favorite.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { Favorite } from 'src/favorite/entity/favorite.entity';

describe('AdminUserService', () => {
  let user: jest.Mocked<User>;
  let userDto: jest.Mocked<User>;
  let favorites: Array<jest.Mocked<Favorite>>;
  let purchases: Array<jest.Mocked<Purchase>>;
  let module: TestingModule;
  let transactionService: TransactionService;
  let manager: jest.Mocked<EntityManager>;
  let favoriteService: jest.Mocked<FavoriteService>;
  let purchaseService: jest.Mocked<PurchaseService>;
  let userService: jest.Mocked<UserService>;
  let service: AdminUserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), TransactionModule],
      providers: [AdminUserService],
    })
      .useMocker(mock)
      .compile();

    user = mock(User);
    userDto = mock(User);
    favorites = [mock(Favorite)];
    purchases = [mock(Purchase)];
    manager = mock(EntityManager);
    transactionService = module.get<TransactionService>(TransactionService);
    favoriteService = module.get<jest.Mocked<FavoriteService>>(FavoriteService);
    purchaseService = module.get<jest.Mocked<PurchaseService>>(PurchaseService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
    service = module.get<AdminUserService>(AdminUserService);
    userService.findOneById.mockResolvedValue(user);
    favoriteService.getFavorites.mockResolvedValue(favorites);
    purchaseService.purchases.mockResolvedValue(purchases);
  });

  describe('User', () => {
    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.user(id, userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user with id', async () => {
      await service.user(id, userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(id, undefined, manager);
    });

    it('should return found user', async () => {
      const result = await service.user(id, userDto, manager);
      expect(result).toEqual(user);
    });
  });

  describe('Favorites', () => {
    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.favorites(id, userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user with id', async () => {
      await service.favorites(id, userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(id, undefined, manager);
    });

    it('should get found user favorites', async () => {
      await service.favorites(id, userDto, manager);
      expect(favoriteService.getFavorites).toHaveBeenCalledWith(user, manager);
    });

    it('should return found favorites', async () => {
      const result = await service.favorites(id, userDto, manager);
      expect(result).toEqual(favorites);
    });
  });

  describe('Purchases', () => {
    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.purchases(id, userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user with id', async () => {
      await service.purchases(id, userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(id, undefined, manager);
    });

    it('should get found user purchases', async () => {
      await service.purchases(id, userDto, manager);
      expect(purchaseService.purchases).toHaveBeenCalledWith(user, manager);
    });

    it('should return found purchases', async () => {
      const result = await service.purchases(id, userDto, manager);
      expect(result).toEqual(purchases);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
