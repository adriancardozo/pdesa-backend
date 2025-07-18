import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { UserRequest } from 'src/auth/type/user-request.type';
import { Product } from './entity/product.entity';
import { ProductResponse } from './response/product.response';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { MetricsInterceptor } from 'src/metrics/interceptor/metrics.interceptor';
import { ProductParam } from './param/product.param';

@ApiBearerAuth()
@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Search products',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: ProductResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(ProductResponse), MetricsInterceptor)
  @Get('search')
  async search(@Query('q') q: string, @Request() req: UserRequest): Promise<Array<Product>> {
    return await this.productService.search(q, req.user);
  }

  @Roles(Role.purchaser, Role.administrator)
  @ApiOperation({
    summary: 'Get product',
    description: `*roles*: **${[Role.administrator, Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: ProductResponse })
  @UseInterceptors(new TransformInterceptor(ProductResponse), MetricsInterceptor)
  @Get(':ml_id')
  async product(@Param() { ml_id }: ProductParam, @Request() req: UserRequest): Promise<Product> {
    return await this.productService.product(ml_id, req.user);
  }
}
