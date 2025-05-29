import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idMl: string;
}
