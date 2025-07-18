import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReviewType } from '../enum/review-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewParam {
  @ApiProperty({ enum: ReviewType })
  @IsEnum(ReviewType)
  @IsNotEmpty()
  review_type: ReviewType;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
