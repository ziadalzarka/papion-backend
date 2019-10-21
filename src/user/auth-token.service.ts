import { User } from 'app/user/user.schema';
import { ConfigUtils } from './../config/config.util';
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthenticationToken } from './token.interface';
import { AuthenticationScope } from './authentication-scope.dto';

@Injectable()
export class AuthTokenService {

  validate(token: string) {
    return jwt.verify(token, ConfigUtils.token.auth) as AuthenticationToken;
  }

  generateToken(_id: string, scopes: AuthenticationScope[]) {
    return jwt.sign({ _id, scopes }, ConfigUtils.token.auth);
  }

}
