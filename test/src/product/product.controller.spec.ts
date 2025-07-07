import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from 'src/product/product.controller';
import { ProductService } from 'src/product/product.service';
import { mock } from 'test/resources/mocks/mock';
import { productParam, q, request } from './test-data/product.controller.spec.data';

describe('ProductController', () => {
  let module: TestingModule;
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ProductController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should delegate search to service', async () => {
    await controller.search(q, request);
    expect(service.search).toHaveBeenCalledWith(q, request.user);
  });

  it('should delegate product to service', async () => {
    await controller.product(productParam, request);
    expect(service.product).toHaveBeenCalledWith(productParam.ml_id, request.user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
