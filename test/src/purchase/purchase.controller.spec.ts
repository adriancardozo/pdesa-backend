import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from 'src/purchase/purchase.controller';
import { PurchaseService } from 'src/purchase/purchase.service';
import { mock } from 'test/resources/mocks/mock';
import { dto, purchaseParam, request } from './test-data/purchase.controller.spec.data';

describe('PurchaseController', () => {
  let module: TestingModule;
  let controller: PurchaseController;
  let service: PurchaseService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [PurchaseController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should delegate purchase to service', async () => {
    await controller.purchase(purchaseParam, dto, request);
    expect(service.purchase).toHaveBeenCalledWith(purchaseParam, dto, request.user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
