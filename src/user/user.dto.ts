import { User } from 'app/user/user.schema';
import { BusinessCategory } from './business-category.dto';
import { Field, Int, ObjectType, ID, InputType, ArgsType, createUnionType } from 'type-graphql';
import { DatabaseEntity } from '@gray/mongoose-database';
import { Address, AddressInput } from 'app/user/address.dto';
import { UserType } from './user-type.dto';

@ObjectType()
export class BaseUserEntity<T> extends DatabaseEntity<T> {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  phone?: string;
  @Field(type => Address, { nullable: true })
  address?: Address;
  @Field(type => UserType)
  userType: UserType;
}

@ObjectType()
export class ClientUserEntity extends BaseUserEntity<ClientUserEntity> { }

@ObjectType()
export class BusinessUserEntity extends BaseUserEntity<BusinessUserEntity> {
  @Field(type => BusinessCategory)
  businessCategory: BusinessCategory;
}

export const UnionUserEntity = (entity: User): UserEntityType => {
  switch (entity.userType) {
    case UserType.Business:
      return new BusinessUserEntity(entity);
    case UserType.Client:
      return new ClientUserEntity(entity);
  }
};

export type UserEntityType = BusinessUserEntity | ClientUserEntity;

export const UserEntity = createUnionType({
  name: 'UserEntity',
  types: [BusinessUserEntity, ClientUserEntity],
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
