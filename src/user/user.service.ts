import { AuthTokenService } from './auth-token.service';
import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { UnauthorizedError } from 'type-graphql';
import { UnionUserEntity, UserEntityType } from './user.dto';
import { AuthenticationScope } from './authentication-scope.dto';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { ObjectID } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>, private authTokenService: AuthTokenService) { }

  private async validateEmailAvailable(email: string) {
    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new GraphQLError('Email already taken');
    }
  }

  async createUser({ password, ...payload }: Partial<User>): Promise<UserEntityType> {
    await this.validateEmailAvailable(payload.email);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const entity = await new this.userModel({
      password: hash,
      ...payload,
    }).save();
    return UnionUserEntity(entity);
  }

  async logInUser(email: string, password: string) {
    const entity = await this.userModel.findOne({ email });
    // compare to hashed password
    const hash = entity.password;
    const valid = bcrypt.compareSync(password, hash);
    if (valid) {
      // generate token only needs _id and scopes
      const token = this.authTokenService.generateToken(entity._id.toHexString(), [AuthenticationScope.client]);
      return { token, user: UnionUserEntity(entity) };
    } else {
      throw new UnauthorizedException();
    }
  }

  async _resolveUser(_id: string | ObjectID) {
    return await this.userModel.findById(_id);
  }
}
