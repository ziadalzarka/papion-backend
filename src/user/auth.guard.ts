import { AuthTokenService } from './auth-token.service';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { Reflector } from '@nestjs/core';
import { UserService } from './user.service';
import { AuthenticationScope } from './token.interface';
import { MissingScopesException } from './exceptions/missing-scopes.exception';
import { ObjectID } from 'bson';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authTokenService: AuthTokenService, private reflector: Reflector, private userService: UserService) { }

  private isUserResolveEnabled(context: ExecutionContext) {
    return this.reflector.get<string[]>('resolve_user', context.getHandler());
  }

  private getHanldlerScopes(context: ExecutionContext): AuthenticationScope[] {
    return this.reflector.get<AuthenticationScope[]>('scopes', context.getHandler()) || [];
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();
    if (req.headers.authorization) {
      const token = req.headers.authorization.slice('Bearer '.length);
      const decoded = this.authTokenService.validate(token);
      if (!decoded) {
        throw new UnauthorizedException();
      } else {
        req.user = { _id: ObjectID.createFromHexString(decoded._id) };
        if (this.isUserResolveEnabled(context)) {
          req.user = await this.userService._resolveUser(decoded._id);
        }
        const handlerScopes = this.getHanldlerScopes(context);
        const scopes = decoded.scopes;
        const matchesScopes = handlerScopes.every(scope => scopes.includes(scope));
        if (matchesScopes) {
          return true;
        } else {
          const missingScopes = handlerScopes.filter(scope => !scopes.includes(scope));
          throw new MissingScopesException(missingScopes);
        }
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
