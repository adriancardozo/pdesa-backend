import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from 'src/review/review.controller';
import { ReviewService } from 'src/review/review.service';
import { mock } from 'test/resources/mocks/mock';
import { param, request, updateDto } from './test-data/review.controller.spec.data';

describe('ReviewController', () => {
  let module: TestingModule;
  let controller: ReviewController;
  let service: ReviewService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ReviewController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);
  });

  it('should delegate update review to service', async () => {
    await controller.updateReview(param, updateDto, request);
    expect(service.updateReview).toHaveBeenCalledWith(param, updateDto, request.user);
  });

  it('should delegate delete review to service', async () => {
    await controller.deleteReview(param, request);
    expect(service.deleteReview).toHaveBeenCalledWith(param, request.user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
