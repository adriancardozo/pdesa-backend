import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from 'src/product/product.service';
import { mock } from 'test/resources/mocks/mock';

describe('ProductService', () => {
  let module: TestingModule;
  let service: ProductService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ProductService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
