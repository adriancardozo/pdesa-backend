import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from 'src/favorite/favorite.controller';
import { FavoriteService } from 'src/favorite/favorite.service';
import { mock } from 'test/resources/mocks/mock';
import { request, idMlDto } from './test-data/favorite.controller.spec.data';

describe('FavoriteController', () => {
  let module: TestingModule;
  let controller: FavoriteController;
  let service: FavoriteService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [FavoriteController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should delegate get favorites to service', async () => {
    await controller.getFavorites(request);
    expect(service.getFavorites).toHaveBeenCalledWith(request.user);
  });

  it('should delegate get favorite to service', async () => {
    await controller.getFavorite(idMlDto, request);
    expect(service.getFavorite).toHaveBeenCalledWith(idMlDto, request.user);
  });

  it('should delegate add favorite to service', async () => {
    await controller.addFavorite(idMlDto, request);
    expect(service.addFavorite).toHaveBeenCalledWith(idMlDto, request.user);
  });

  it('should delegate delete favorite to service', async () => {
    await controller.deleteFavorite(idMlDto, request);
    expect(service.deleteFavorite).toHaveBeenCalledWith(idMlDto, request.user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
