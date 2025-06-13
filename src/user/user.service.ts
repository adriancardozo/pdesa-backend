import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { EntityManager, FindOneOptions } from 'typeorm';
import { TransactionService } from 'src/transaction/transaction.service';
import { HashService } from 'src/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPayload } from './type/user-payload.type';
import { Configuration } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';
import { UsersQueries } from './queries/users.queries';

@Injectable()
export class UserService {
  private readonly errorRegexes: Configuration['error']['regex'];
  private readonly errors: Configuration['error']['message'];

  constructor(
    private readonly hashService: HashService,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {
    this.errorRegexes = this.configService.get('error.regex')!;
    this.errors = this.configService.get('error.message')!;
  }

  async findOneById(
    id: string,
    relations: FindOneOptions<User>['relations'],
    manager?: EntityManager,
  ): Promise<User> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id }, relations });
      if (!user) throw new NotFoundException(this.errors.userNotFound);
      return user;
    }, manager);
  }

  async findOneByUsername(username: string, manager?: EntityManager): Promise<User | null> {
    return await this.transactionService.transaction(async (manager) => {
      return await manager.findOneBy(User, { username });
    }, manager);
  }

  async findOneByPayload({ username }: UserPayload, manager?: EntityManager): Promise<User | null> {
    return await this.findOneByUsername(username, manager);
  }

  async users({ role }: UsersQueries, manager?: EntityManager): Promise<Array<User>> {
    return await this.transactionService.transaction(async (manager) => {
      return await manager.findBy(User, { role });
    }, manager);
  }

  async create(dto: CreateUserDto, manager?: EntityManager): Promise<User> {
    return await this.transactionService.transaction(async (manager) => {
      try {
        dto.password = await this.hashService.data(dto.password);
        const user = manager.create(User, dto);
        return await manager.save(user);
      } catch (error) {
        let exception = this.errors.onCreateUser;
        if (this.errorRegexes.unique.test(error)) exception = this.errors.userAlreadyExists;
        throw new BadRequestException(exception);
      }
    }, manager);
  }
}
