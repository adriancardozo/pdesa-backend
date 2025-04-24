import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from 'src/favorite/favorite.controller';
import { FavoriteService } from 'src/favorite/favorite.service';
import { mock } from 'test/resources/mocks/mock';

describe('FavoriteController', () => {
  let module: TestingModule;
  let controller: FavoriteController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [FavoriteService],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<FavoriteController>(FavoriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
