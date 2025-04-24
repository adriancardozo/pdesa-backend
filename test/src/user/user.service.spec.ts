import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { mock } from 'test/resources/mocks/mock';

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
