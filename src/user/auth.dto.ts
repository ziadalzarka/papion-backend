import { UserEntity, UserEntityType } from 'app/user/user.dto';
import { ObjectType, Field, InputType } from 'type-graphql';
import { User } from 'app/user/user.schema';

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
