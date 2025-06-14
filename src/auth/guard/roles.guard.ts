import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRequest } from '../type/user-request.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user }: UserRequest = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
