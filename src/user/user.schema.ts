import { BusinessCategory } from './business-category.dto';
import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { Address } from 'app/user/address.dto';
import { AuthPayload } from 'app/user/auth.dto';
import { UserType } from './user-type.dto';
import { UserEntity, CreateBusinessUserInput, CreateClientUserInput, UserEntityType } from './user.dto';

@schema({})
export class IUser {
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

export type User = IUser & mongoose.Document;

export abstract class IQuery {
  abstract me(): User | Promise<User>;
  abstract logIn(email: string, password: string): AuthPayload | Promise<AuthPayload>;
  abstract signUpClientUser(payload: CreateClientUserInput): UserEntityType | Promise<UserEntityType>;
  abstract signUpBusinessUser(payload: CreateBusinessUserInput): UserEntityType | Promise<UserEntityType>;
}
