import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from 'src/product/product.controller';
import { ProductService } from 'src/product/product.service';
import { mock } from 'test/resources/mocks/mock';

describe('ProductController', () => {
  let module: TestingModule;
  let controller: ProductController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
