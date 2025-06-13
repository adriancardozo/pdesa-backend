import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from 'src/favorite/favorite.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { mock } from 'test/resources/mocks/mock';
import {
  configuration,
  createdFavorite,
  deletedFavorite,
  favorite,
  idMlDto,
  product,
  productRelations,
  user,
  userDto,
  userRelations,
} from './test-data/favorite.service.spec.data';
import { TransactionService } from 'src/transaction/transaction.service';
import { EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { ProductService } from 'src/product/product.service';

describe('FavoriteService', () => {
  let module: TestingModule;
  let service: FavoriteService;
  let transactionService: TransactionService;
  let manager: jest.Mocked<EntityManager>;
  let userService: jest.Mocked<UserService>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), TransactionModule],
      providers: [FavoriteService],
    })
      .useMocker(mock)
      .compile();

    manager = mock(EntityManager);
    service = module.get<FavoriteService>(FavoriteService);
    transactionService = module.get<TransactionService>(TransactionService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
    productService = module.get<jest.Mocked<ProductService>>(ProductService);
  });

  describe('Get favorites', () => {
    beforeEach(() => {
      userService.findOneById.mockResolvedValue(user);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.getFavorites(userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user', async () => {
      await service.getFavorites(userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
    });

    it('should return user favorites', async () => {
      const result = await service.getFavorites(userDto, manager);
      expect(result).toEqual(user.favorites);
    });
  });

  describe('Get favorite', () => {
    let user: jest.Mocked<User>;

    beforeEach(() => {
      user = mock(User);
      user.getFavorite.mockReturnValue(favorite);
      userService.findOneById.mockResolvedValue(user);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.getFavorite(idMlDto, userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user', async () => {
      await service.getFavorite(idMlDto, userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
    });

    it('should get favorite', async () => {
      await service.getFavorite(idMlDto, userDto, manager);
      expect(user.getFavorite).toHaveBeenCalledWith(idMlDto.idMl);
    });

    it('should return favorite', async () => {
      const result = await service.getFavorite(idMlDto, userDto, manager);
      expect(result).toEqual(favorite);
    });
  });

  describe('Add favorite', () => {
    let user: jest.Mocked<User>;

    beforeEach(() => {
      user = mock(User);
      user.addFavorite.mockReturnValue(createdFavorite);
      userService.findOneById.mockResolvedValue(user);
      productService.getOrCreateProduct.mockResolvedValue(product);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.addFavorite(idMlDto, userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user', async () => {
      await service.addFavorite(idMlDto, userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
    });

    it('should get or create product', async () => {
      await service.addFavorite(idMlDto, userDto, manager);
      expect(productService.getOrCreateProduct).toHaveBeenCalledWith(
        idMlDto.idMl,
        productRelations,
        manager,
      );
    });

    it('should add favorite to user', async () => {
      await service.addFavorite(idMlDto, userDto, manager);
      expect(user.addFavorite).toHaveBeenCalledWith(product);
    });

    it('should save added favorite', async () => {
      await service.addFavorite(idMlDto, userDto, manager);
      expect(manager.save).toHaveBeenCalledWith(user);
    });

    it('should return created favorite', async () => {
      const result = await service.addFavorite(idMlDto, userDto, manager);
      expect(result).toEqual(createdFavorite);
    });

    it('should can call multiple times without fail', async () => {
      await service.addFavorite(idMlDto, userDto, manager);
      const result = await service.addFavorite(idMlDto, userDto, manager);
      expect(result).toEqual(createdFavorite);
    });
  });

  describe('Delete favorite', () => {
    let user: jest.Mocked<User>;

    beforeEach(() => {
      user = mock(User);
      user.deleteFavorite.mockReturnValue(deletedFavorite);
      userService.findOneById.mockResolvedValue(user);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.deleteFavorite(idMlDto, userDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user', async () => {
      await service.deleteFavorite(idMlDto, userDto, manager);
      expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
    });

    it('should delete favorite to user', async () => {
      await service.deleteFavorite(idMlDto, userDto, manager);
      expect(user.deleteFavorite).toHaveBeenCalledWith(idMlDto.idMl);
    });

    it('should delete user favorite', async () => {
      await service.deleteFavorite(idMlDto, userDto, manager);
      expect(manager.save).toHaveBeenCalledWith(user);
    });

    it('should delete favorite', async () => {
      await service.deleteFavorite(idMlDto, userDto, manager);
      expect(manager.softRemove).toHaveBeenCalledWith(deletedFavorite);
    });

    it('should return deleted favorite', async () => {
      const result = await service.deleteFavorite(idMlDto, userDto, manager);
      expect(result).toEqual(deletedFavorite);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
