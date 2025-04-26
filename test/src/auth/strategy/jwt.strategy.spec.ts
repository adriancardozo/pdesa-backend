import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { configuration, payload, user } from './test-data/jwt.strategy.spec.data';

describe('JwtStrategy', () => {
  let module: TestingModule;
  let userService: jest.Mocked<UserService>;
  let strategy: JwtStrategy;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [JwtStrategy],
    })
      .useMocker(mock)
      .compile();

    userService = module.get<jest.Mocked<UserService>>(UserService);
    strategy = module.get<JwtStrategy>(JwtStrategy);

    userService.findOneByPayload.mockResolvedValue(user);
  });

  describe('Validate', () => {
    it('should find user from payload', async () => {
      await strategy.validate(payload);
      expect(userService.findOneByPayload).toHaveBeenCalledWith(payload);
    });

    it('should return find result', async () => {
      const result = await strategy.validate(payload);
      expect(result).toEqual(user);
    });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  afterEach(async () => await module.close());
});
