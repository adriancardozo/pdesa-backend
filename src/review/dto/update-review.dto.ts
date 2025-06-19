import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ nullable: true, required: false })
  @IsNumber()
  @IsOptional()
  rate?: number;
  @ApiProperty({ nullable: true, required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
