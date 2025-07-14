import { Response } from 'src/shared/responses/response';
import { Purchase } from '../entity/purchase.entity';
import { ProductResponse } from 'src/product/response/product.response';
import { ReviewResponse } from 'src/review/response/review.response';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseResponse extends Response<Purchase> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  final_price: number;
  @ApiProperty()
  amount: number;
  @ApiProperty({ example: new Date().toISOString() })
  created_at: string;
  @ApiProperty({ type: ProductResponse })
  product: ProductResponse;
  @ApiProperty({ type: ReviewResponse })
  review: ReviewResponse;

  constructor(purchase: Purchase, mapper: ResponseMapper) {
    super(purchase, mapper);
    this.id = purchase.id;
    this.price = purchase.price;
    this.final_price = purchase.finalPrice;
    this.amount = purchase.amount;
    this.created_at = purchase.createdAt.toISOString();
    this.product = mapper.map(purchase.product, ProductResponse);
    this.review = mapper.map(purchase.review, ReviewResponse);
  }
}
