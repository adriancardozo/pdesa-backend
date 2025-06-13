import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { mock } from 'test/resources/mocks/mock';
import { usersQueries } from './test-data/user.controller.spec.data';

describe('UserController', () => {
  let module: TestingModule;
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should delegate users to service', async () => {
    await controller.users(usersQueries);
    expect(service.users).toHaveBeenCalledWith(usersQueries);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
