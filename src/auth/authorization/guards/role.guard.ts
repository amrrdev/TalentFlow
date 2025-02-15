import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY, ROLES_KEY } from '../../auth.constants';
import { Role } from '../../../users/enum/role.enum';
import { ActiveUserDate } from '../../interfaces/active-user-data.interface';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) return true;

    const user: ActiveUserDate = context.switchToHttp().getRequest<Request>()[REQUEST_USER_KEY];
    if (!contextRoles.some(role => user.role === role)) {
      throw new UnauthorizedException(`Access denied. Required roles: ${contextRoles.join(', ')}`);
    }

    return true;
  }
}
