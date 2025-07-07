import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { IdMlDto } from 'src/favorite/dto/id-ml.dto';
import { UserRequest } from 'src/auth/type/user-request.type';
import { Purchase } from './entity/purchase.entity';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PurchaseResponse } from './response/purchase.response';
import { PurchaseDto } from './dto/purchase.dto';

@Controller('purchase')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @ApiBearerAuth()
  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Purchase product',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: PurchaseResponse })
  @UseInterceptors(new TransformInterceptor(PurchaseResponse))
  @Post(':idMl')
  async purchase(
    @Param() purchaseParam: IdMlDto,
    @Body() dto: PurchaseDto,
    @Request() req: UserRequest,
  ): Promise<Purchase> {
    return await this.purchaseService.purchase(purchaseParam, dto, req.user);
  }
}
