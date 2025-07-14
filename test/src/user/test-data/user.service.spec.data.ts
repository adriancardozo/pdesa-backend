import realConfiguration from 'src/config/configuration';
import type { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/enum/role.enum';
import { UsersQueries } from 'src/user/queries/users.queries';
import { FindOneOptions, QueryFailedError } from 'typeorm';

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

export const errors = {
  userAlreadyExists: 'User already exists',
  onCreateUser: 'Error on create user',
  userNotFound: 'User not found.',
};

const uniqueRegex = realConfiguration().error.regex.unique;

export const configuration = () => ({ error: { message: errors, regex: { unique: uniqueRegex } } });

export const users = [
  { id: '3', username: 'administrator3', password: 'Administrator3!', role: Role.administrator },
  { id: '4', username: 'administrator4', password: 'Administrator4!', role: Role.administrator },
  { id: '5', username: 'purchaser5', password: 'Purchaser5!', role: Role.purchaser },
  { id: '6', username: 'purchaser6', password: 'Purchaser6!', role: Role.purchaser },
] as Array<User>;

export const undefinedRoleUsersQueries = {} as UsersQueries;

export const usersQueries = undefinedRoleUsersQueries;

export const purchaserUsersQueries = { role: Role.purchaser } as UsersQueries;

export const administratorUsersQueries = { role: Role.administrator } as UsersQueries;

export const id = payload.id;

export const relations = {} as FindOneOptions<User>['relations'];

export const ids = users.map((user) => ({ id: user.id }));

export const emptyIds = [];

export const emptyUsers = [];
