import { ApiProperty } from '@nestjs/swagger';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { Response } from 'src/shared/responses/response';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/enum/role.enum';

export class UserResponse extends Response<User> {
  @ApiProperty()
  id: string;
  @ApiProperty({ enum: Role })
  role: Role;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;

  constructor(user: User, mapper: ResponseMapper) {
    super(user, mapper);
    this.id = user.id;
    this.role = user.role;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
