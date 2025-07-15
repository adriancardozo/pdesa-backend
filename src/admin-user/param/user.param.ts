import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserParam {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
