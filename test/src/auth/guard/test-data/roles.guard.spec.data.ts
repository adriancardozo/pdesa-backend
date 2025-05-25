import { UserRequest } from 'src/auth/type/user-request.type';
import type { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/enum/role.enum';

export const requiredRoles = [Role.purchaser];

export const userWithRequiredRoles = { id: '1', username: 'user1', role: Role.purchaser } as User;

export const userWithoutRequiredRoles = { id: '2', username: 'user2', role: Role.administrator } as User;

export const userWithRequiredRolesRequest = { user: userWithRequiredRoles } as UserRequest;

export const userWithoutRequiredRolesRequest = { user: userWithoutRequiredRoles } as UserRequest;
