import { BusinessCategory } from './business-category.dto';
import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { Address } from './address.dto';
import { AuthPayload } from './auth.dto';
import { UserType } from './user-type.dto';
import { UserEntity, CreateBusinessUserInput, CreateClientUserInput } from './user.dto';
import { ObjectID } from 'mongodb';

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
  phone: string;
  @field
  address: Address;
  @field
  userType: UserType;
  @field
  businessCategory: BusinessCategory;
}

export const UserSchema = buildSchema(IUser);

mongoose.model('User', UserSchema);

export type User = IUser & mongoose.Document;
