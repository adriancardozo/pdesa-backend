import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from 'src/image/image.service';
import { mock } from 'test/resources/mocks/mock';

describe('ImageService', () => {
  let module: TestingModule;
  let service: ImageService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ImageService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
