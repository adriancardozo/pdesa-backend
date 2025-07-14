import { Controller, Get, Request, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminMetricsService } from './admin-metrics.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { UserRequest } from 'src/auth/type/user-request.type';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { Top5UserResponse } from './response/top-5-user.response';
import { Top5PurchasedProductResponse } from './response/top-5-purchased-product.response';
import { Top5FavoritedProductResponse } from './response/top-5-favorited-product.response';

@ApiBearerAuth()
@ApiTags('Administrator metrics')
@Controller('admin/metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class AdminMetricsController {
  constructor(private readonly metricsService: AdminMetricsService) {}

  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'Top 5 purchased products',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: Top5PurchasedProductResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(Top5PurchasedProductResponse))
  @Get('purchase/top_five')
  async top5Purchased(@Request() req: UserRequest): Promise<Array<Product>> {
    return await this.metricsService.top5Purchased(req.user);
  }

  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'Top 5 favorite products',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: Top5FavoritedProductResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(Top5FavoritedProductResponse))
  @Get('favorite/top_five')
  async top5Favorited(@Request() req: UserRequest): Promise<Array<Product>> {
    return await this.metricsService.top5Favorited(req.user);
  }

  @Roles(Role.administrator)
  @ApiOperation({
    summary: 'Top 5 purchasers',
    description: `*roles*: **${[Role.administrator].toString()}**`,
  })
  @ApiResponse({ type: Top5UserResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(Top5UserResponse))
  @Get('purchaser/top_five')
  async top5Purchaser(@Request() req: UserRequest): Promise<Array<User>> {
    return await this.metricsService.top5Purchaser(req.user);
  }
}
