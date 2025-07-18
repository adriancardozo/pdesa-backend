import { Response } from 'src/shared/responses/response';
import { Review } from '../entity/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FavoriteResponse } from 'src/favorite/response/favorite.response';
import { PurchaseResponse } from 'src/purchase/response/purchase.response';
import { ReviewType } from '../enum/review-type.enum';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';

export class ReviewableResponse extends Response<Review> {
  @ApiProperty({ type: FavoriteResponse, nullable: true, required: false })
  favorite: FavoriteResponse;
  @ApiProperty({ type: PurchaseResponse, nullable: true, required: false })
  purchase: PurchaseResponse;

  constructor(review: Review, mapper: ResponseMapper) {
    super(review, mapper);
    const { reviewType } = review.reviewable;
    if (reviewType === ReviewType.favorite) this.favorite = mapper.map(review.reviewable, FavoriteResponse);
    if (reviewType === ReviewType.purchase) this.purchase = mapper.map(review.reviewable, PurchaseResponse);
  }
}
