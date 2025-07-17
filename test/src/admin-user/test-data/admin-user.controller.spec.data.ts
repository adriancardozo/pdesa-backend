import { UserParam } from 'src/admin-user/param/user.param';
import type { UserRequest } from 'src/auth/type/user-request.type';

export const params = { user_id: '2' } as UserParam;

export const request = { user: { id: '1' } } as UserRequest;
