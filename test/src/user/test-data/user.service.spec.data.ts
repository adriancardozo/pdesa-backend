import realConfiguration from 'src/config/configuration';
import type { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/enum/role.enum';
import { QueryFailedError } from 'typeorm';

export const username = 'user1';

export const payload = { id: '1', username };

export const user = { ...payload, password: 'password1' } as User;

export const createUserDto = {
  firstName: 'Created',
  lastName: 'User',
  dni: '98128972',
  email: 'createduser@email.com',
  username: 'createduser',
  password: 'createduserpassword',
  role: Role.purchaser,
};

export const passwordHash = 'passwordhash';

export const createUserDtoWithPasswordHash = {
  ...createUserDto,
  password: passwordHash,
};

export const createdUser = createUserDtoWithPasswordHash as User;

export const savedUser = { ...createdUser, id: '2' } as User;

export const uniqueError = new QueryFailedError('UNIQUE', undefined, { message: 'UNIQUE', name: 'UNIQUE' });

export const notUniqueError = new QueryFailedError('GENERIC', undefined, {
  message: 'GENERIC',
  name: 'GENERIC',
});

export const errors = { userAlreadyExists: 'User already exists', onCreateUser: 'Error on create user' };

const uniqueRegex = realConfiguration().error.regex.unique;

export const configuration = () => ({ error: { message: errors, regex: { unique: uniqueRegex } } });
