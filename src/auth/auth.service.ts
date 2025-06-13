import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenResponse } from './response/token.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly transactionService: TransactionService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const matched = this.hashService.compare(password, user.password);
      if (matched) return user;
    }
    return null;
  }

  async login({ id, username }: User): Promise<TokenResponse> {
    const payload = { id, username };
    return new TokenResponse(await this.jwtService.signAsync(payload));
  }

  profile(user: User): User {
    return user;
  }

  async register(dto: CreateUserDto, manager?: EntityManager): Promise<TokenResponse> {
    return await this.transactionService.transaction(async (manager) => {
      const user = await this.usersService.create(dto, manager);
      return await this.login(user);
    }, manager);
  }
}
