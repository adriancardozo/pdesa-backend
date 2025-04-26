import { Controller, Get, Post, Request, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { UserRequest } from './type/user-request.type';

@Controller('auth')
@UsePipes(VALIDATION_PIPE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: UserRequest) {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Profile', description: `*roles*: **ANY**` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: UserRequest) {
    return this.authService.profile(req.user);
  }
}
