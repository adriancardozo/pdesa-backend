import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { mock } from 'test/resources/mocks/mock';
import { EntityManager } from 'typeorm';
import {
  administratorUsersQueries,
  configuration,
  createdUser,
  createUserDto,
  createUserDtoWithPasswordHash,
  errors,
  id,
  ids,
  emptyIds,
  emptyUsers,
  notUniqueError,
  passwordHash,
  payload,
  purchaserUsersQueries,
  relations,
  savedUser,
  undefinedRoleUsersQueries,
  uniqueError,
  user,
  username,
  users,
  usersQueries,
} from './test-data/user.service.spec.data';
import { HashService } from 'src/hash/hash.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Role } from 'src/user/enum/role.enum';

describe('UserService', () => {
  let module: TestingModule;
  let transactionService: TransactionService;
  let manager: jest.Mocked<EntityManager>;
  let hashService: jest.Mocked<HashService>;
  let service: UserService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), TransactionModule],
      providers: [UserService],
    })
      .useMocker(mock)
      .compile();

    manager = mock(EntityManager);
    transactionService = module.get<TransactionService>(TransactionService);
    hashService = module.get<jest.Mocked<HashService>>(HashService);
    service = module.get<UserService>(UserService);
  });

  describe('Find one by id', () => {
    beforeEach(() => {
      manager.findOne.mockResolvedValue(user);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findOneById(id, relations, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user by id', async () => {
      await service.findOneById(id, relations, manager);
      expect(manager.findOne).toHaveBeenCalledWith(User, { where: { id }, relations });
    });

    it('should return found user', async () => {
      const result = await service.findOneById(id, relations, manager);
      expect(result).toEqual(user);
    });

    it('should throw user not found error', async () => {
      manager.findOne.mockResolvedValue(null);
      await expect(service.findOneById(id, relations, manager)).rejects.toMatchObject(
        new NotFoundException(errors.userNotFound),
      );
    });
  });

  describe('Find one by username', () => {
    beforeEach(() => {
      manager.findOneBy.mockResolvedValue(user);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findOneByUsername(username, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user by username', async () => {
      await service.findOneByUsername(username, manager);
      expect(manager.findOneBy).toHaveBeenCalledWith(User, { username });
    });

    it('should return found user', async () => {
      const result = await service.findOneByUsername(username, manager);
      expect(result).toEqual(user);
    });
  });

  describe('Find one by payload', () => {
    beforeEach(() => {
      manager.findOneBy.mockResolvedValue(user);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findOneByPayload(payload, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should find user by payload username', async () => {
      await service.findOneByPayload(payload, manager);
      expect(manager.findOneBy).toHaveBeenCalledWith(User, { username: payload.username });
    });

    it('should return found user', async () => {
      const result = await service.findOneByPayload(payload, manager);
      expect(result).toEqual(user);
    });
  });

  describe('Users', () => {
    beforeEach(() => {
      manager.findBy.mockResolvedValue(users);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.users(usersQueries, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should get application users', async () => {
      await service.users(undefinedRoleUsersQueries, manager);
      expect(manager.findBy).toHaveBeenCalledWith(User, { role: undefined });
    });

    it('should get purchaser users', async () => {
      await service.users(purchaserUsersQueries, manager);
      expect(manager.findBy).toHaveBeenCalledWith(User, { role: Role.purchaser });
    });

    it('should get administrator users', async () => {
      await service.users(administratorUsersQueries, manager);
      expect(manager.findBy).toHaveBeenCalledWith(User, { role: Role.administrator });
    });

    it('should return users', async () => {
      const result = await service.users(usersQueries, manager);
      expect(result).toEqual(users);
    });
  });

  describe('Find users by ids ', () => {
    beforeEach(() => {
      manager.find.mockResolvedValue(users);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.findUsersByIds(ids, relations, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it("should not find users by ids if there aren't ids", async () => {
      await service.findUsersByIds(emptyIds, relations, manager);
      expect(manager.find).toHaveBeenCalledTimes(0);
    });

    it("should return empty result if there aren't ids", async () => {
      const result = await service.findUsersByIds(emptyIds, relations, manager);
      expect(result).toEqual(emptyUsers);
    });

    it('should find users by ids', async () => {
      await service.findUsersByIds(ids, relations, manager);
      expect(manager.find).toHaveBeenCalledWith(User, { where: ids, relations });
    });

    it('should return found users', async () => {
      const result = await service.findUsersByIds(ids, relations, manager);
      expect(result).toEqual(users);
    });
  });

  describe('Create', () => {
    beforeEach(() => {
      hashService.data.mockResolvedValue(passwordHash);
      (manager.create as unknown as jest.Mock<User>).mockReturnValue(createdUser);
      manager.save.mockResolvedValue(savedUser);
    });

    it('should run in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await service.create(createUserDto, manager);
      expect(transaction).toHaveBeenCalled();
    });

    it('should generate password hash', async () => {
      await service.create(createUserDto, manager);
      expect(hashService.data).toHaveBeenCalledWith(createUserDto.password);
    });

    it('should create user with password hash', async () => {
      await service.create(createUserDto, manager);
      expect(manager.create).toHaveBeenCalledWith(User, createUserDtoWithPasswordHash);
    });

    it('should save created user', async () => {
      await service.create(createUserDto, manager);
      expect(manager.save).toHaveBeenCalledWith(createdUser);
    });

    it('should return saved user', async () => {
      const result = await service.create(createUserDto, manager);
      expect(result).toEqual(savedUser);
    });

    describe('Error handling', () => {
      beforeEach(() => {
        manager.save.mockRejectedValue(uniqueError);
      });

      it('should throw user already exists error', async () => {
        await expect(service.create(createUserDto, manager)).rejects.toMatchObject(
          new BadRequestException(errors.userAlreadyExists),
        );
      });

      it('should throw error on create user', async () => {
        manager.save.mockRejectedValue(notUniqueError);
        await expect(service.create(createUserDto, manager)).rejects.toMatchObject(
          new BadRequestException(errors.onCreateUser),
        );
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
