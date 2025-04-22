import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreController } from 'src/mercado-libre/mercado-libre.controller';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';

describe('MercadoLibreController', () => {
  let controller: MercadoLibreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MercadoLibreController],
      providers: [MercadoLibreProductService],
    }).compile();

    controller = module.get<MercadoLibreController>(MercadoLibreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
