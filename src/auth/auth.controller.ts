import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { UserRequest } from './type/user-request.type';
import { TokenResponse } from './response/token.response';
import { RegisterPurchaserDto } from './dto/register-purchaser.dto';
import { RegisterAdministratorDto } from './dto/register-administrator.dto';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { User } from 'src/user/entity/user.entity';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { UserResponse } from './response/user.response';

@Controller('auth')
@UsePipes(VALIDATION_PIPE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: TokenResponse })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: UserRequest): Promise<TokenResponse> {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register purchaser' })
  @ApiResponse({ type: TokenResponse })
  @ApiBody({ type: RegisterPurchaserDto })
  @Post('register/purchaser')
  async registerPurchaser(@Body() registerDto: RegisterPurchaserDto): Promise<TokenResponse> {
    return await this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'Register administrator',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: TokenResponse })
  @ApiBody({ type: RegisterAdministratorDto })
  @Post('register/administrator')
  async registerAdministrator(@Body() registerDto: RegisterAdministratorDto): Promise<TokenResponse> {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Profile', description: `*roles*: **ANY**` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserResponse })
  @UseInterceptors(new TransformInterceptor(UserResponse))
  @Get('profile')
  profile(@Request() req: UserRequest): User {
    return this.authService.profile(req.user);
  }
}
