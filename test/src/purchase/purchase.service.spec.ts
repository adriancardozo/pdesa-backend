import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from 'src/purchase/purchase.service';
import { mock } from 'test/resources/mocks/mock';

describe('PurchaseService', () => {
  let module: TestingModule;
  let service: PurchaseService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PurchaseService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
