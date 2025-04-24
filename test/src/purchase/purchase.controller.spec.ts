import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from 'src/purchase/purchase.controller';
import { PurchaseService } from 'src/purchase/purchase.service';
import { mock } from 'test/resources/mocks/mock';

describe('PurchaseController', () => {
  let module: TestingModule;
  let controller: PurchaseController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [PurchaseService],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
