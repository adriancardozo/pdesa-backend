import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { mock } from 'test/resources/mocks/mock';

describe('UserController', () => {
  let module: TestingModule;
  let controller: UserController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
