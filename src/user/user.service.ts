import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { AuthTokenService } from './auth-token.service';
import { BusinessCategory } from './business-category.dto';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { AuthenticationScope } from './token.interface';
import { UserType } from './user-type.dto';
import { UserEntity } from './user.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>, private authTokenService: AuthTokenService) { }

  private async validateEmailAvailable(email: string) {
    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new GraphQLError('Email already taken');
    }
  }

  async createUser({ password, ...payload }: Partial<User>): Promise<typeof UserEntity> {
    await this.validateEmailAvailable(payload.email);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return await new this.userModel({
      password: hash,
      ...payload,
    }).save();
  }

  private userToAuthenticationScopes(entity: User) {
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
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UserNotFoundException();
    }
    // compare to hashed password
    const hash = user.password;
    const valid = bcrypt.compareSync(password, hash);
    if (valid) {
      // generate token only needs _id and scopes
      const token = this.authTokenService.generateToken(user._id.toHexString(), this.userToAuthenticationScopes(user));
      return { token, user };
    } else {
      throw new UnauthorizedException();
    }
  }

  async _resolveUser(_id: string | ObjectID, projection = {}) {
    return await this.userModel.findById(_id, projection);
  }
}
