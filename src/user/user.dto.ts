import { User } from './user.schema';
import { BusinessCategory } from './business-category.dto';
import { Field, Int, ObjectType, ID, InputType, ArgsType, createUnionType } from 'type-graphql';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { Address, AddressInput } from './address.dto';
import { UserType } from './user-type.dto';
import { File } from '@gray/graphql-essentials';

@ObjectType()
export class BaseUserEntity<T> extends DatabaseEntity<T> {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  phone?: string;
  @Field({ nullable: true })
  profileImage?: string;
  @Field(type => Address, { nullable: true })
  address?: Address;
  @Field(type => UserType)
  userType: UserType;
}

@ObjectType()
export class AdminUserEntity extends BaseUserEntity<ClientUserEntity> { }

@ObjectType()
export class ClientUserEntity extends BaseUserEntity<ClientUserEntity> { }

@ObjectType()
export class BusinessUserEntity extends BaseUserEntity<BusinessUserEntity> {
  @Field(type => BusinessCategory)
  businessCategory: BusinessCategory;
}

export const UserEntity = createUnionType({
  name: 'UserEntity',
  types: [BusinessUserEntity, ClientUserEntity, AdminUserEntity],
  resolveType: entity => {
    switch (entity.userType) {
      case UserType.Business:
        return 'BusinessUserEntity';
      case UserType.Client:
        return 'ClientUserEntity';
      case UserType.Admin:
        return 'AdminUserEntity';
    }
  },
});

@InputType()
export class CreateClientUserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  phone: string;
  @Field(type => AddressInput)
  address: AddressInput;
}

@InputType()
export class CreateBusinessUserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  phone: string;
  @Field(type => AddressInput)
  address: AddressInput;
  @Field(type => BusinessCategory)
  businessCategory: BusinessCategory;
}

@InputType()
export class UpdateUserProfileInput {
  @Field({ nullable: true })
  name?: string;
  @Field(type => File, { nullable: true })
  profileImage?: string;
  @Field(type => AddressInput, { nullable: true })
  address?: AddressInput;
  @Field({ nullable: true })
  password?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  oldPassword?: string;
}
