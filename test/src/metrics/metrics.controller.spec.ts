import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from 'src/metrics/metrics.controller';
import { MetricsService } from 'src/metrics/metrics.service';
import { mock } from 'test/resources/mocks/mock';
import { request, response } from './test-data/metrics.controller.spec.data';

describe('MetricsController', () => {
  let module: TestingModule;
  let controller: MetricsController;
  let service: MetricsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [MetricsController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<MetricsController>(MetricsController);
    service = module.get<MetricsService>(MetricsService);
  });

  it('should delegate metrics to service', async () => {
    await controller.metrics(request, response);
    expect(service.metrics).toHaveBeenCalledWith(request, response);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
