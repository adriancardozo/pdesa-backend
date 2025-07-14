import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/auth/response/user.response';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { Response } from 'src/shared/responses/response';
import { User } from 'src/user/entity/user.entity';

export class Top5UserResponse extends Response<User> {
  @ApiProperty()
  amount: number;
  @ApiProperty({ type: UserResponse })
  content: UserResponse;

  constructor(user: User, mapper: ResponseMapper) {
    super(user, mapper);
    this.amount = user.amountPurchases;
    this.content = mapper.map(user, UserResponse);
  }
}
