import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { LocalStrategy } from 'src/auth/strategy/local.strategy';
import { user, username, password } from './test-data/local.strategy.spec.data';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

describe('LocalStrategy', () => {
  let module: TestingModule;
  let authService: jest.Mocked<AuthService>;
  let strategy: LocalStrategy;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [LocalStrategy],
    })
      .useMocker(mock)
      .compile();

    authService = module.get<jest.Mocked<AuthService>>(AuthService);
    strategy = module.get<LocalStrategy>(LocalStrategy);

    authService.validateUser.mockResolvedValue(user);
  });

  describe('Validate', () => {
    it('should find user', async () => {
      await strategy.validate(username, password);
      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should return user', async () => {
      const result = await strategy.validate(username, password);
      expect(result).toEqual(user);
    });

    it('should fail if user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);
      await expect(strategy.validate(username, password)).rejects.toMatchObject(
        new UnauthorizedException(),
      );
    });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  afterEach(async () => await module.close());
});
