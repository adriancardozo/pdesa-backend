import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { params, request } from './test-data/admin-user.controller.spec.data';
import { AdminUserController } from 'src/admin-user/admin-user.controller';
import { AdminUserService } from 'src/admin-user/admin-user.service';

describe('AdminUserController', () => {
  let module: TestingModule;
  let controller: AdminUserController;
  let service: AdminUserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AdminUserController],
    })
      .useMocker(mock)
      .compile();

    controller = module.get<AdminUserController>(AdminUserController);
    service = module.get<AdminUserService>(AdminUserService);
  });

  it('should delegate user to service', async () => {
    await controller.user(params, request);
    expect(service.user).toHaveBeenCalledWith(params.user_id, request.user);
  });

  it('should delegate favorites to service', async () => {
    await controller.favorites(params, request);
    expect(service.favorites).toHaveBeenCalledWith(params.user_id, request.user);
  });

  it('should delegate purchases to service', async () => {
    await controller.purchases(params, request);
    expect(service.purchases).toHaveBeenCalledWith(params.user_id, request.user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => await module.close());
});
