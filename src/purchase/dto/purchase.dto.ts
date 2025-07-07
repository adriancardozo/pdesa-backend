import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PurchaseDto {
  @ApiProperty({ default: 1, required: false })
  @IsNumber()
  @IsOptional()
  amount: number = 1;
}
