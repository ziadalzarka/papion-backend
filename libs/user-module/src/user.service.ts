import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { AuthTokenService } from './auth-token.service';
import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { UnionUserEntity, UserEntityType } from './user.dto';
import { AuthenticationScope } from './token.interface';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { ObjectID } from 'mongodb';
import { UserType } from './user-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessCategory } from './business-category.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>, private authTokenService: AuthTokenService) { }

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

  private entityToAuthenticationScopes(entity: User) {
    if (entity.userType === UserType.Business) {
      if (entity.businessCategory === BusinessCategory.Person) {
        return [AuthenticationScope.RegisterPersonBusiness];
      } else {
        return [AuthenticationScope.RegisterPlaceBusiness];
      }
    } else {
      return [AuthenticationScope.WeddingWebsites];
    }
  }

  async logInUser(email: string, password: string) {
    const entity = await this.userModel.findOne({ email });
    if (!entity) {
      throw new UserNotFoundException();
    }
    // compare to hashed password
    const hash = entity.password;
    const valid = bcrypt.compareSync(password, hash);
    if (valid) {
      // generate token only needs _id and scopes
      const token = this.authTokenService.generateToken(entity._id.toHexString(), this.entityToAuthenticationScopes(entity));
      return { token, user: UnionUserEntity(entity) };
    } else {
      throw new UnauthorizedException();
    }
  }

  async _resolveUser(_id: string | ObjectID) {
    return await this.userModel.findById(_id);
  }
}
