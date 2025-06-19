import { ApiProperty } from '@nestjs/swagger';
import { ReviewType } from '../enum/review-type.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewerType } from '../enum/reviewer-type.enum';

export class GetReviewsQuery {
  @ApiProperty({ enum: ReviewType, nullable: true, required: false })
  @IsEnum(ReviewType)
  @IsOptional()
  review_type?: ReviewType;
  @ApiProperty({ nullable: true, required: false })
  @IsString()
  @IsOptional()
  id?: string;
  @ApiProperty({ enum: ReviewerType, default: ReviewerType.owner, nullable: true, required: false })
  @IsEnum(ReviewerType)
  @IsOptional()
  reviewers: ReviewerType = ReviewerType.owner;
}
