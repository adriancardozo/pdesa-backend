import type { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/enum/role.enum';

export const username = 'user1';

export const password = 'password1';

export const user = { id: '1', username } as User;

export const payload = { id: user.id, username: user.username };

export const token = 'token';

export const createUserDto = {
  firstName: 'Created',
  lastName: 'User',
  dni: '98128972',
  email: 'createduser@email.com',
  username: 'createduser',
  password: 'createduserpassword',
  role: Role.purchaser,
};

export const createdUser = {
  id: '2',
  firstName: 'Created',
  lastName: 'User',
  dni: '98128972',
  email: 'createduser@email.com',
  username: 'createduser',
  password: 'createduserpassword',
  role: Role.purchaser,
} as User;

export const createdUserPayload = { id: createdUser.id, username: createdUser.username };
