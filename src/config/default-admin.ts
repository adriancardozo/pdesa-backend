import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Role } from 'src/user/enum/role.enum';

export function defaultAdmin(): CreateUserDto {
  return plainToInstance(CreateUserDto, {
    email: 'admin@admin.admin',
    firstName: 'Admin',
    lastName: 'Admin',
    dni: '646464',
    role: Role.administrator,
    username: process.env.DEFAULT_ADMIN_USERNAME ?? 'admin',
    password: process.env.DEFAULT_ADMIN_PASSWORD ?? 'Admin1234!',
  });
}
