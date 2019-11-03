import { registerEnumType } from 'type-graphql';

export enum UserType {
  Admin = 'admin',
  Client = 'client',
  Business = 'business',
}

registerEnumType(UserType, { name: 'UserType' });
