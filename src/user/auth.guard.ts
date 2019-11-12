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
    return this.reflector.get<string[]>('resolve_user', context.getHandler()) ? true : false;
  }

  private getHanldlerScopes(context: ExecutionContext): AuthenticationScope[] {
    return this.reflector.get<AuthenticationScope[]>('scopes', context.getHandler()) || [];
  }

  private extractToken(ctx) {
    const { req, query } = ctx.getContext();
    if (req) {
      return req.headers.authorization.slice('Bearer '.length);
    } else if (query) {
      return query.token;
    } else {
      return undefined;
    }
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const token = this.extractToken(ctx);
    if (token) {
      const { user } = await this.guard(token, this.getHanldlerScopes(context), this.isUserResolveEnabled(context));
      ctx.getContext().meta.user = user;
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  async guard(token: string, handlerScopes: AuthenticationScope[] = [], resolveUser = false) {
    const decoded = this.authTokenService.validate(token);
    if (!decoded) {
      throw new UnauthorizedException();
    } else {
      let user = { _id: ObjectID.createFromHexString(decoded._id) };
      if (resolveUser) {
        user = await this.userService._resolveUser(decoded._id);
      }
      const scopes = decoded.scopes;
      const matchesScopes = handlerScopes.every(scope => scopes.includes(scope));
      if (matchesScopes) {
        return { user };
      } else {
        const missingScopes = handlerScopes.filter(scope => !scopes.includes(scope));
        throw new MissingScopesException(missingScopes);
      }
    }
  }
}
