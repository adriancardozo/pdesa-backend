import { RegisterAdministratorDto } from 'src/auth/dto/register-administrator.dto';
import { RegisterPurchaserDto } from 'src/auth/dto/register-purchaser.dto';
import { UserRequest } from 'src/auth/type/user-request.type';
import { Role } from 'src/user/enum/role.enum';

export const request = {
  user: { id: '1', username: 'user1', password: 'password1' },
} as UserRequest;

export const registerPurchaserDto = {
  firstName: 'Purchaser1',
  lastName: 'Purchaser1',
  dni: '2111111',
  email: 'purchaser1@email.com',
  password: 'Purchaser1!',
  username: 'purchaser1',
  role: Role.purchaser,
} as RegisterPurchaserDto;

export const registerAdministratorDto = {
  firstName: 'Administrator1',
  lastName: 'Administrator1',
  dni: '1111111',
  email: 'administrator1@email.com',
  password: 'Administrator1!',
  username: 'administrator1',
  role: Role.administrator,
} as RegisterAdministratorDto;
