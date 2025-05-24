import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum/role.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UsersQueries {
  @ApiProperty({ enum: Role, required: false, nullable: true })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
