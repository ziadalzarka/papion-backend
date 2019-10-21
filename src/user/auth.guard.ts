import { AuthTokenService } from './auth-token.service';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { UnauthorizedException } from './exceptions/unauthorized.exception';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authTokenService: AuthTokenService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (req.headers.authorization) {
      const token = req.headers.authorization.slice('Bearer '.length);
      const decoded = this.authTokenService.validate(token);
      if (!decoded) {
        throw new UnauthorizedException();
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
