import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { MercadoLibreProductService } from './mercado-libre-product.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MercadoLibreSearchResult } from './entity/mercado-libre-search-result.entity';

@ApiBearerAuth()
@Controller('mercado-libre/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class MercadoLibreController {
  constructor(private readonly mercadoLibreService: MercadoLibreProductService) {}

  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Search products from Mercado Libre',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: MercadoLibreSearchResult })
  @Get('search')
  search(@Query('q') q: string) {
    return this.mercadoLibreService.search(q);
  }
}
