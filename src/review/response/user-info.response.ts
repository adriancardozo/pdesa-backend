import { ApiProperty } from '@nestjs/swagger';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { Response } from 'src/shared/responses/response';
import { User } from 'src/user/entity/user.entity';

export class UserInfoResponse extends Response<User> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;

  constructor(user: User, mapper: ResponseMapper) {
    super(user, mapper);
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}
