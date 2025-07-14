import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { AdminMetricsController } from 'src/admin-metrics/admin-metrics.controller';
import { AdminMetricsService } from 'src/admin-metrics/admin-metrics.service';
import { request } from './test-data/admin-metrics.controller.spec.data';

describe('AdminMetricsController', () => {
  let module: TestingModule;
  let controller: AdminMetricsController;
  let service: AdminMetricsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AdminMetricsController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<AdminMetricsController>(AdminMetricsController);
    service = module.get<AdminMetricsService>(AdminMetricsService);
  });

  it('should delegate top five purchased to service', async () => {
    await controller.top5Purchased(request);
    expect(service.top5Purchased).toHaveBeenCalledWith(request.user);
  });

  it('should delegate top five favorited to service', async () => {
    await controller.top5Favorited(request);
    expect(service.top5Favorited).toHaveBeenCalledWith(request.user);
  });

  it('should delegate top five purchaser to service', async () => {
    await controller.top5Purchaser(request);
    expect(service.top5Purchaser).toHaveBeenCalledWith(request.user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
