import type { Favorite } from 'src/favorite/entity/favorite.entity';
import type { Role } from '../enum/role.enum';

export class User {
  id: string;
  role: Role;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  favorites: Array<Favorite>;
}
