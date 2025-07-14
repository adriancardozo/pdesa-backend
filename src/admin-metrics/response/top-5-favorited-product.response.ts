import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entity/product.entity';
import { ProductResponse } from 'src/product/response/product.response';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { Response } from 'src/shared/responses/response';

export class Top5FavoritedProductResponse extends Response<Product> {
  @ApiProperty()
  amount: number;
  @ApiProperty({ type: ProductResponse })
  content: ProductResponse;

  constructor(product: Product, mapper: ResponseMapper) {
    super(product, mapper);
    this.amount = product.amountFavorites;
    this.content = mapper.map(product, ProductResponse);
  }
}
