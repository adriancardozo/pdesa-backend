import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MercadoLibreProductService } from './mercado-libre-product.service';
import { ApiOperation } from '@nestjs/swagger';
import { VALIDATION_PIPE } from 'src/shared/validation/validation.pipe';

@Controller('mercado-libre/products')
@UsePipes(VALIDATION_PIPE)
export class MercadoLibreController {
  constructor(private readonly mercadoLibreService: MercadoLibreProductService) {}

  @ApiOperation({ summary: 'Search products from Mercado Libre' })
  @Get('search')
  search(@Query('q') q: string) {
    return this.mercadoLibreService.search(q);
  }
}
