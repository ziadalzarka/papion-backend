import { AuthTokenService } from './auth-token.service';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { Reflector } from '@nestjs/core';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authTokenService: AuthTokenService, private reflector: Reflector, private userService: UserService) { }

  private isUserResolveEnabled(context: ExecutionContext) {
    return this.reflector.get<string[]>('resolve_user', context.getHandler());
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (req.headers.authorization) {
      const token = req.headers.authorization.slice('Bearer '.length);
      const decoded = this.authTokenService.validate(token);
      if (!decoded) {
        throw new UnauthorizedException();
      } else {
        if (this.isUserResolveEnabled(context)) {
          req.user = await this.userService._resolveUser(decoded._id);
        }
        return true;
      }
    } else {
      return false;
    }
  }
}
