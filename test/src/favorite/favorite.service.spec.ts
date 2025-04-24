import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from 'src/favorite/favorite.service';
import { mock } from 'test/resources/mocks/mock';

describe('FavoriteService', () => {
  let module: TestingModule;
  let service: FavoriteService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [FavoriteService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
