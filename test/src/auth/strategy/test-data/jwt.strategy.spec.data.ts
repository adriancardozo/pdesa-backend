import type { User } from 'src/user/entity/user.entity';
import { UserPayload } from 'src/user/type/user-payload.type';

export const configuration = () => ({ jwt: { secret: 'secret' } });

export const payload: UserPayload = { id: '1', username: 'user1' };

export const user = { ...payload, password: 'password1' } as User;
