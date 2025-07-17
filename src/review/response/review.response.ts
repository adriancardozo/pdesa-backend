import { Response } from 'src/shared/responses/response';
import { Review } from '../entity/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ReviewType } from '../enum/review-type.enum';

export class ReviewResponse extends Response<Review> {
  @ApiProperty()
  id: string;
  @ApiProperty({ enum: ReviewType })
  type: ReviewType;
  @ApiProperty()
  rate: number;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  reviewed: boolean;

  constructor(review: Review, mapper: ResponseMapper) {
    super(review, mapper);
    const { id, idMl, reviewType } = review.reviewable;
    this.id = reviewType === ReviewType.favorite ? idMl : id;
    this.type = reviewType;
    this.rate = review.rate ?? '';
    this.comment = review.comment ?? '';
    this.reviewed = review.reviewed;
  }
}
