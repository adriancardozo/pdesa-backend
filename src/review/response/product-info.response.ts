import { Response } from 'src/shared/responses/response';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ApiProperty } from '@nestjs/swagger';
import type { Product } from 'src/product/entity/product.entity';

export class ProductInfoResponse extends Response<Product> {
  @ApiProperty()
  ml_id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  constructor(product: Product, mapper: ResponseMapper) {
    super(product, mapper);
    this.ml_id = product.idMl;
    this.name = product.name;
    this.description = product.description;
  }
}
