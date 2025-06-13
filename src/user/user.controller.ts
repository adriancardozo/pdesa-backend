import { Controller, Get, Query, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { UsersQueries } from './queries/users.queries';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { UserResponse } from './response/user.response';
import { User } from './entity/user.entity';

@Controller('user')
@UsePipes(VALIDATION_PIPE)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'List users',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: UserResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(UserResponse))
  @Get()
  async users(@Query() usersQueries: UsersQueries): Promise<Array<User>> {
    return await this.userService.users(usersQueries);
  }
}
