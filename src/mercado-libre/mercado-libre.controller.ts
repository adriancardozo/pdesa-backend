import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { MercadoLibreProductService } from './mercado-libre-product.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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
  @Get('search')
  search(@Query('q') q: string) {
    return this.mercadoLibreService.search(q);
  }
}
