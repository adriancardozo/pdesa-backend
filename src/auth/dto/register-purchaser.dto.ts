import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/enum/role.enum';

export class RegisterPurchaserDto implements CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dni: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  get role(): Role {
    return Role.purchaser;
  }
}
