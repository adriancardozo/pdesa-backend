import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { HashModule } from 'src/hash/hash.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from 'src/config/jwt.secret';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { defaultAdmin } from 'src/config/default-admin';
import { ValidationModule } from 'src/validation/validation.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Module({
  imports: [
    UserModule,
    HashModule,
    PassportModule,
    JwtModule.register({ secret: jwt.secret, signOptions: { expiresIn: '10d' } }),
    TransactionModule,
    ValidationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
  private readonly errors: Configuration['error']['message'];

  constructor(
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {
    this.errors = this.configService.getOrThrow('error.message');
  }

  async onModuleInit() {
    await this.transactionService.transaction(async (manager) => {
      try {
        await this.authService.register(defaultAdmin(), manager);
      } catch (error) {
        if (!error.message || this.errors.userAlreadyExists !== error.message) throw error;
      }
    });
  }
}
