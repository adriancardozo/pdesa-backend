import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from 'src/validation/validation.service';
import { mock } from 'test/resources/mocks/mock';

describe('ValidationService', () => {
  let module: TestingModule;
  let service: ValidationService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ValidationService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
