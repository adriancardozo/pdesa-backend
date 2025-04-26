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
  constructor(
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
  ) {}

  async onModuleInit() {
    await this.transactionService.transaction(async (manager) => {
      try {
        await this.authService.register(defaultAdmin(), manager);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        /* empty */
      }
    });
  }
}
