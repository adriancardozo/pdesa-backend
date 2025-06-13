import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { mock } from 'test/resources/mocks/mock';
import {
  createdUser,
  createdUserPayload,
  createUserDto,
  password,
  payload,
  token,
  user,
  username,
} from './test-data/auth.service.spec.data';
import { EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { HashService } from 'src/hash/hash.service';

describe('AuthService', () => {
  let module: TestingModule;
  let manager: EntityManager;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<UserService>;
  let hashService: jest.Mocked<HashService>;
  let service: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TransactionModule],
      providers: [AuthService],
    })
      .useMocker(mock)
      .compile();

    jwtService = module.get<jest.Mocked<JwtService>>(JwtService);
    userService = module.get<jest.Mocked<UserService>>(UserService);
    hashService = module.get<jest.Mocked<HashService>>(HashService);
    service = module.get<AuthService>(AuthService);

    manager = mock(EntityManager);
    jwtService.signAsync.mockResolvedValue(token);
  });

  describe('Login', () => {
    it('should sign in user', async () => {
      await service.login(user);
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });

    it('should return access token response', async () => {
      const result = await service.login(user);
      expect(result).toMatchObject({ access_token: token });
    });
  });

  describe('Profile', () => {
    it('should return passed user', () => {
      const result = service.profile(user);
      expect(result).toEqual(user);
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      userService.create.mockResolvedValue(createdUser);
    });

    it('should create user', async () => {
      await service.register(createUserDto, manager);
      expect(userService.create).toHaveBeenCalledWith(createUserDto, manager);
    });

    it('should sign in created user', async () => {
      await service.register(createUserDto, manager);
      expect(jwtService.signAsync).toHaveBeenCalledWith(createdUserPayload);
    });

    it('should return access token response', async () => {
      const result = await service.register(createUserDto, manager);
      expect(result).toMatchObject({ access_token: token });
    });
  });

  describe('Validate user', () => {
    beforeEach(() => {
      userService.findOneByUsername.mockResolvedValue(user);
      hashService.compare.mockReturnValue(true);
    });

    it('should find user', async () => {
      await service.validateUser(username, password);
      expect(userService.findOneByUsername).toHaveBeenCalledWith(username);
    });

    it('should return user if password matches', async () => {
      const result = await service.validateUser(username, password);
      expect(result).toEqual(user);
    });

    it('should return null if password not matches', async () => {
      hashService.compare.mockReturnValue(false);
      const result = await service.validateUser(username, password);
      expect(result).toEqual(null);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
