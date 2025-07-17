import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { ReviewService } from 'src/review/review.service';
import {
  favoriteParam,
  purchaseParam,
  updateDto,
  userDto,
  userRelations,
} from './test-data/review.service.spec.data';
import { FavoriteService } from 'src/favorite/favorite.service';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Review } from 'src/review/entity/review.entity';
import { PurchaseService } from 'src/purchase/purchase.service';
import { Purchase } from 'src/purchase/entity/purchase.entity';

describe('ReviewService', () => {
  let module: TestingModule;
  let service: ReviewService;
  let transactionService: TransactionService;
  let user: jest.Mocked<User>;
  let favorite: jest.Mocked<Favorite>;
  let purchase: jest.Mocked<Purchase>;
  let review: jest.Mocked<Review>;
  let manager: jest.Mocked<EntityManager>;
  let userService: jest.Mocked<UserService>;
  let favoriteService: jest.Mocked<FavoriteService>;
  let purchaseService: jest.Mocked<PurchaseService>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ReviewService],
      imports: [TransactionModule],
    })
      .useMocker(mock)
      .compile();

    manager = mock(EntityManager);
    user = mock(User);
    favorite = mock(Favorite);
    purchase = mock(Purchase);
    review = mock(Review);
    service = module.get<ReviewService>(ReviewService);
    transactionService = module.get<TransactionService>(TransactionService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
    favoriteService = module.get<jest.Mocked<FavoriteService>>(FavoriteService);
    purchaseService = module.get<jest.Mocked<PurchaseService>>(PurchaseService);
  });

  describe('Update review', () => {
    beforeEach(() => {
      userService.findOneById.mockResolvedValue(user);
      favoriteService.getFavorite.mockResolvedValue(favorite);
      favorite.updateReview.mockReturnValue(review);
      purchaseService.getPurchase.mockResolvedValue(purchase);
      purchase.updateReview.mockReturnValue(review);
    });

    describe('Favorite', () => {
      it('should run in transaction', async () => {
        const transaction = jest.spyOn(transactionService, 'transaction');
        await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(transaction).toHaveBeenCalled();
      });

      it('should find user', async () => {
        await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
      });

      it('should get favorite', async () => {
        await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(favoriteService.getFavorite).toHaveBeenCalledWith(
          { idMl: favoriteParam.id },
          userDto,
          manager,
        );
      });

      it('should update favorite review', async () => {
        await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(favorite.updateReview).toHaveBeenCalledWith(updateDto);
      });

      it('should save favorite', async () => {
        await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(manager.save).toHaveBeenCalledWith(favorite);
      });

      it('should set favorite query user', async () => {
        await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(favorite.setQueryUser).toHaveBeenCalledWith(user);
      });

      it('should return updated favorite review', async () => {
        const result = await service.updateReview(favoriteParam, updateDto, userDto, manager);
        expect(result).toEqual(review);
      });
    });
    describe('Purchase', () => {
      it('should run in transaction', async () => {
        const transaction = jest.spyOn(transactionService, 'transaction');
        await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(transaction).toHaveBeenCalled();
      });

      it('should find user', async () => {
        await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
      });

      it('should get purchase', async () => {
        await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(purchaseService.getPurchase).toHaveBeenCalledWith(purchaseParam.id, userDto, manager);
      });

      it('should update purchase review', async () => {
        await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(purchase.updateReview).toHaveBeenCalledWith(updateDto);
      });

      it('should save purchase', async () => {
        await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(manager.save).toHaveBeenCalledWith(purchase);
      });

      it('should set purchase query user', async () => {
        await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(purchase.setQueryUser).toHaveBeenCalledWith(user);
      });

      it('should return updated purchase review', async () => {
        const result = await service.updateReview(purchaseParam, updateDto, userDto, manager);
        expect(result).toEqual(review);
      });
    });
  });

  describe('Delete review', () => {
    beforeEach(() => {
      userService.findOneById.mockResolvedValue(user);
      favoriteService.getFavorite.mockResolvedValue(favorite);
      favorite.deleteReview.mockReturnValue(review);
      purchaseService.getPurchase.mockResolvedValue(purchase);
      purchase.deleteReview.mockReturnValue(review);
    });

    describe('Favorite', () => {
      it('should run in transaction', async () => {
        const transaction = jest.spyOn(transactionService, 'transaction');
        await service.deleteReview(favoriteParam, userDto, manager);
        expect(transaction).toHaveBeenCalled();
      });

      it('should find user', async () => {
        await service.deleteReview(favoriteParam, userDto, manager);
        expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
      });

      it('should get favorite', async () => {
        await service.deleteReview(favoriteParam, userDto, manager);
        expect(favoriteService.getFavorite).toHaveBeenCalledWith(
          { idMl: favoriteParam.id },
          userDto,
          manager,
        );
      });

      it('should update favorite review', async () => {
        await service.deleteReview(favoriteParam, userDto, manager);
        expect(favorite.deleteReview).toHaveBeenCalledWith();
      });

      it('should save favorite', async () => {
        await service.deleteReview(favoriteParam, userDto, manager);
        expect(manager.save).toHaveBeenCalledWith(favorite);
      });

      it('should set favorite query user', async () => {
        await service.deleteReview(favoriteParam, userDto, manager);
        expect(favorite.setQueryUser).toHaveBeenCalledWith(user);
      });

      it('should return updated favorite review', async () => {
        const result = await service.deleteReview(favoriteParam, userDto, manager);
        expect(result).toEqual(review);
      });
    });
    describe('Purchase', () => {
      it('should run in transaction', async () => {
        const transaction = jest.spyOn(transactionService, 'transaction');
        await service.deleteReview(purchaseParam, userDto, manager);
        expect(transaction).toHaveBeenCalled();
      });

      it('should find user', async () => {
        await service.deleteReview(purchaseParam, userDto, manager);
        expect(userService.findOneById).toHaveBeenCalledWith(userDto.id, userRelations, manager);
      });

      it('should get purchase', async () => {
        await service.deleteReview(purchaseParam, userDto, manager);
        expect(purchaseService.getPurchase).toHaveBeenCalledWith(purchaseParam.id, userDto, manager);
      });

      it('should update purchase review', async () => {
        await service.deleteReview(purchaseParam, userDto, manager);
        expect(purchase.deleteReview).toHaveBeenCalledWith();
      });

      it('should save purchase', async () => {
        await service.deleteReview(purchaseParam, userDto, manager);
        expect(manager.save).toHaveBeenCalledWith(purchase);
      });

      it('should set purchase query user', async () => {
        await service.deleteReview(purchaseParam, userDto, manager);
        expect(purchase.setQueryUser).toHaveBeenCalledWith(user);
      });

      it('should return updated purchase review', async () => {
        const result = await service.deleteReview(purchaseParam, userDto, manager);
        expect(result).toEqual(review);
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
