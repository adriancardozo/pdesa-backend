import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { mock } from 'test/resources/mocks/mock';
import { request } from './test-data/auth.controller.spec.data';

describe('AuthController', () => {
  let module: TestingModule;
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(mock)
      .compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should delegate login to service', async () => {
    await controller.login(request);
    expect(service.login).toHaveBeenCalledWith(request.user);
  });

  it('should delegate profile to service', () => {
    controller.profile(request);
    expect(service.profile).toHaveBeenCalledWith(request.user);
  });

  afterEach(async () => await module.close());
});
