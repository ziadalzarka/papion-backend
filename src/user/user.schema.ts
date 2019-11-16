import { UserResetPasswordStore } from './reset.interface';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, schema, unique } from 'mongoose-schema-decorators';
import { Address } from './address.dto';
import { BusinessCategory } from './business-category.dto';
import { UserType } from './user-type.dto';
import { ensureProjection } from 'app/shared/mongoose.util';

@schema({})
export class IUser {
  readonly _id: ObjectID;
  @field
  name: string;
  @unique
  @field
  email: string;
  @field
  password: string;
  @field
  profileImage: string;
  @field
  phone: string;
  @field
  address: Address;
  @field
  userType: UserType;
  @field
  businessCategory: BusinessCategory;
  @field
  reset: UserResetPasswordStore;
}

export const UserSchema = buildSchema(IUser);

// always include uesr type because it is needed for type resolving
ensureProjection(UserSchema, { userType: true });

UserSchema.index({ 'reset.code': 1 });

mongoose.model('User', UserSchema);

export type User = IUser & mongoose.Document;
