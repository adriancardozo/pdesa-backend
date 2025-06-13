import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Reflector } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import {
  requiredRoles,
  userWithoutRequiredRolesRequest,
  userWithRequiredRolesRequest,
} from './test-data/roles.guard.spec.data';
import { UserRequest } from 'src/auth/type/user-request.type';

describe('RolesGuard', () => {
  let module: TestingModule;
  let context: jest.Mocked<ExecutionContext>;
  let reflector: jest.Mocked<Reflector>;
  let guard: RolesGuard;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    })
      .useMocker(mock)
      .overrideProvider(Reflector)
      .useValue(mock(Reflector))
      .compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<jest.Mocked<Reflector>>(Reflector);
    context = mock(ExecutionContextHost);
  });

  describe('Can activate', () => {
    let getRequest: jest.Mock<UserRequest>;

    function mockRequest(): jest.Mock {
      getRequest = jest.fn();
      context.switchToHttp.mockReturnValue({ getRequest } as unknown as HttpArgumentsHost);
      return getRequest;
    }

    beforeEach(() => {
      reflector.getAllAndOverride.mockReturnValue(requiredRoles);
      getRequest = mockRequest();
      getRequest.mockReturnValue(userWithRequiredRolesRequest);
    });

    it('should handle request if not roles required', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
      const result = guard.canActivate(context);
      expect(result).toBeTruthy();
    });

    it('should handle request if user has some of required roles', () => {
      const result = guard.canActivate(context);
      expect(result).toBeTruthy();
    });

    it("shouldn't handle request if user has not any of required roles", () => {
      getRequest.mockReturnValue(userWithoutRequiredRolesRequest);
      const result = guard.canActivate(context);
      expect(result).toBeFalsy();
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  afterEach(async () => await module.close());
});
