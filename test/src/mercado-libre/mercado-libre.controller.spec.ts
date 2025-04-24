import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreController } from 'src/mercado-libre/mercado-libre.controller';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';
import { mock } from 'test/resources/mocks/mock';
import { query } from './test-data/mercado-libre.controller.spec.data';

describe('MercadoLibreController', () => {
  let module: TestingModule;
  let controller: MercadoLibreController;
  let service: MercadoLibreProductService;

  beforeEach(async () => {
    module = await Test.createTestingModule({ controllers: [MercadoLibreController] })
      .useMocker(mock)
      .compile();

    controller = module.get<MercadoLibreController>(MercadoLibreController);
    service = module.get<MercadoLibreProductService>(MercadoLibreProductService);
  });

  describe('root', () => {
    it('should delegate to service', async () => {
      await controller.search(query);
      expect(service.search).toHaveBeenCalledWith(query);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
