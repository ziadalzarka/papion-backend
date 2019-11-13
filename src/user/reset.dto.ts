import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class ResetPasswordUserSummary {
  @Field()
  name: string;
  @Field()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  code: string;
  @Field()
  password: string;
}
