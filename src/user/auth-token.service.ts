import { User } from './user.schema';
import { ConfigUtils } from 'app/config/config.util';
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthenticationToken, AuthenticationScope } from './token.interface';

@Injectable()
export class AuthTokenService {

  validate(token: string) {
    return jwt.verify(token, ConfigUtils.token.auth) as AuthenticationToken;
  }

  generateToken(_id: string, scopes: AuthenticationScope[]) {
    return jwt.sign({ _id, scopes }, ConfigUtils.token.auth);
  }

}
