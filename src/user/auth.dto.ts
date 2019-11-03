import { UserEntity } from './user.dto';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;
  @Field(type => UserEntity)
  user: typeof UserEntity;
}

@InputType()
export class LogInPayload {
  @Field()
  email: string;
  @Field()
  password: string;
}
