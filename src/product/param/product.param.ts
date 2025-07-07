import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductParam {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ml_id: string;
}
