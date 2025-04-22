import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';

describe('MercadoLibreService', () => {
  let service: MercadoLibreProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MercadoLibreProductService],
    }).compile();

    service = module.get<MercadoLibreProductService>(MercadoLibreProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
