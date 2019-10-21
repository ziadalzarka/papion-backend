import { User } from 'app/user/user.schema';
import { ConfigUtils } from './../config/config.util';
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthenticationToken } from './token.interface';
import { AuthenticationScope } from './authentication-scope.dto';

@Injectable()
export class AuthTokenService {

  private _cache = {};

  validate(token: string) {
    const decoded = jwt.verify(token, ConfigUtils.token.auth) as AuthenticationToken;
    return decoded.iat >= this._cache[decoded._id] ? decoded : false;
  }

  generateToken(_id: string, scopes: AuthenticationScope[]) {
    // store what the date of the last valid token issued is
    this._cache[_id] = Math.floor(Date.now() / 1000);
    // add _id of the user for easy lookups in the database
    const token = jwt.sign({ _id, scopes }, ConfigUtils.token.auth);
    return token;
  }

}
