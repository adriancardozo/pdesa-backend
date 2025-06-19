import { Response } from 'src/shared/responses/response';
import { Review } from '../entity/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ReviewType } from '../enum/review-type.enum';
import { UserInfoResponse } from './user-info.response';
import { ProductInfoResponse } from './product-info.response';

export class ReviewResponse extends Response<Review> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  review_type: ReviewType;
  @ApiProperty({ nullable: true })
  rate?: number;
  @ApiProperty({ nullable: true })
  comment?: string;
  @ApiProperty({ type: ProductInfoResponse })
  product: ProductInfoResponse;
  @ApiProperty({ type: UserInfoResponse })
  user: UserInfoResponse;

  constructor(review: Review, mapper: ResponseMapper) {
    super(review, mapper);
    const { id, idMl, reviewType, product, user } = review.reviewable;
    this.id = reviewType === ReviewType.favorite ? idMl : id;
    this.review_type = reviewType;
    this.rate = review.rate;
    this.comment = review.comment;
    this.product = mapper.map(product, ProductInfoResponse);
    this.user = mapper.map(user, UserInfoResponse);
  }
}
