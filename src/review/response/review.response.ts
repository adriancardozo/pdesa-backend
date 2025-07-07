import { Response } from 'src/shared/responses/response';
import { Review } from '../entity/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';

export class ReviewResponse extends Response<Review> {
  @ApiProperty()
  rate: number;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  reviewed: boolean;

  constructor(review: Review, mapper: ResponseMapper) {
    super(review, mapper);
    this.rate = review.rate ?? '';
    this.comment = review.comment ?? '';
    this.reviewed = review.reviewed;
  }
}
