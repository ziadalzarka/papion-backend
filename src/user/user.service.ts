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
import { User, IUser } from './user.schema';
import { EmailService } from '@gray/email/email.service';
import * as shortid from 'shortid';
import * as moment from 'moment';
import { ConfigUtils } from 'app/config/config.util';
import { UserResetCodeExpiredException } from './exceptions/user-reset-code-expired.exception';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authTokenService: AuthTokenService,
    private emailService: EmailService) { }

  private async validateEmailAvailable(email: string) {
    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new GraphQLError('Email already taken');
    }
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  async createUser({ password, ...payload }: Partial<User>): Promise<typeof UserEntity> {
    await this.validateEmailAvailable(payload.email);
    return await new this.userModel({
      password: this.hashPassword(password),
      ...payload,
    }).save();
  }

  private userToAuthenticationScopes(entity: User) {
    switch (entity.userType) {
      case UserType.Business:
        switch (entity.businessCategory) {
          case BusinessCategory.Person:
            return [AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPersonBusiness];
          case BusinessCategory.Place:
            return [AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPlaceBusiness];
        }
      case UserType.Client:
        return [AuthenticationScope.WeddingWebsites, AuthenticationScope.Reserve];
      case UserType.Admin:
        return [AuthenticationScope.AdminPackages];
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

  async generatePasswordResetCode(query, projection = {}) {
    const code = shortid.generate();
    const expires = moment(new Date()).add(ConfigUtils.metadata.resetCodeExpiresAfter, 'seconds').toDate();
    const doc = await this.userModel.findOneAndUpdate(query, { reset: { code, expires } }, {
      select: {
        name: true,
        email: true,
        ...projection,
      },
      new: true,
    });
    this.emailService.sendMail({
      to: doc.email,
      template: 'reset-password',
      subject: 'Reset your password',
      context: {
        name: doc.name,
        code,
      },
    });
    return doc;
  }

  async validatePasswordResetCode(code: string, projection = {}) {
    const doc = await this.userModel.findOne({ 'reset.code': code } as any, {
      ...projection,
      reset: true,
    });
    if (!doc || doc.reset.expires < new Date()) {
      throw new UserResetCodeExpiredException();
    }
    return doc;
  }

  async resetUserPassword(id: ObjectID, password: string) {
    await this.userModel.findByIdAndUpdate(id, {
      password: this.hashPassword(password),
      reset: null,
    });
  }

  async updateUser(id: ObjectID, payload: Partial<IUser>, population = {}) {
    return await this.userModel.findByIdAndUpdate(id, {
      ...payload,
      ...payload.password && { password: this.hashPassword(payload.password) },
    }, { new: true, select: population });
  }
}
