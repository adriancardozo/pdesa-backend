import { Controller, Get, Param, Request, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/user/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { FavoriteResponse } from 'src/favorite/response/favorite.response';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { UserRequest } from 'src/auth/type/user-request.type';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { UserParam } from './param/user.param';
import { PurchaseResponse } from 'src/purchase/response/purchase.response';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { UserResponse } from 'src/user/response/user.response';
import { User } from 'src/user/entity/user.entity';

@ApiBearerAuth()
@ApiTags('Administrator user')
@Controller('admin/user/:user_id')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'User',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: UserResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(UserResponse))
  @Get()
  async user(@Param() { user_id }: UserParam, @Request() req: UserRequest): Promise<User> {
    return await this.adminUserService.user(user_id, req.user);
  }

  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'User favorites',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Get('favorite')
  async favorites(@Param() { user_id }: UserParam, @Request() req: UserRequest): Promise<Array<Favorite>> {
    return await this.adminUserService.favorites(user_id, req.user);
  }

  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'User purchases',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: PurchaseResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(PurchaseResponse))
  @Get('purchase')
  async purchases(@Param() { user_id }: UserParam, @Request() req: UserRequest): Promise<Array<Purchase>> {
    return await this.adminUserService.purchases(user_id, req.user);
  }
}
