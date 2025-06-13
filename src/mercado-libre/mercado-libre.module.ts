import { Module } from '@nestjs/common';
import { MercadoLibreProductService } from './mercado-libre-product.service';
import { MercadoLibreController } from './mercado-libre.controller';
import { HttpModule } from '@nestjs/axios';
import { ValidationModule } from 'src/validation/validation.module';
import { JSONFileModule } from 'src/json-file/json-file.module';

@Module({
  imports: [HttpModule, ValidationModule, JSONFileModule],
  controllers: [MercadoLibreController],
  providers: [MercadoLibreProductService],
  exports: [MercadoLibreProductService],
})
export class MercadoLibreModule {}
