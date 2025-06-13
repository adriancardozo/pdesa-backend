import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/enum/role.enum';

export const defaults = {
  purchaser: plainToInstance(CreateUserDto, {
    email: 'purchaser@purchaser.purchaser',
    firstName: 'Purchaser',
    lastName: 'Purchaser',
    dni: '757575',
    role: Role.purchaser,
    username: 'purchaser',
    password: 'Purchaser1234!',
  }),
};
