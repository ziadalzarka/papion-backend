import { UserEntity, UserEntityType } from './user.dto';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;
  @Field(type => UserEntity)
  user: UserEntityType;
}

@InputType()
export class LogInPayload {
  @Field()
  email: string;
  @Field()
  password: string;
}
