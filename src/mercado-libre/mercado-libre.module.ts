import { Module } from '@nestjs/common';
import { MercadoLibreProductService } from './mercado-libre-product.service';
import { MercadoLibreController } from './mercado-libre.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MercadoLibreController],
  providers: [MercadoLibreProductService],
  exports: [MercadoLibreProductService],
})
export class MercadoLibreModule {}
