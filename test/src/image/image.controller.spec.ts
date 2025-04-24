import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from 'src/image/image.controller';
import { ImageService } from 'src/image/image.service';
import { mock } from 'test/resources/mocks/mock';

describe('ImageController', () => {
  let module: TestingModule;
  let controller: ImageController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [ImageService],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<ImageController>(ImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
