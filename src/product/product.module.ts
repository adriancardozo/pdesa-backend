import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MercadoLibreModule } from 'src/mercado-libre/mercado-libre.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [MercadoLibreModule, TransactionModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
