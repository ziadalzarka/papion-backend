import { ObjectType, Field, InputType } from 'type-graphql';
import { DatabaseEntity } from '@gray/mongoose-database';
import { UserEntityType, UserEntity } from '@gray/user-module/user.dto';

@ObjectType()
export class WeddingWebsiteData {
  @Field()
  coupleName: string;
}

@ObjectType()
export class WeddingWebsiteEntity extends DatabaseEntity {
  @Field()
  subdomain: string;
  @Field(type => WeddingWebsiteData)
  data: WeddingWebsiteData;
  @Field(type => UserEntity)
  user: UserEntityType;
  @Field()
  href: string;
}

@InputType()
export class WeddingWebsiteDataInput {
  @Field()
  coupleName: string;
}

@InputType()
export class WeddingWebsiteInput {
  @Field()
  subdomain: string;
  @Field(type => WeddingWebsiteDataInput)
  data: WeddingWebsiteDataInput;
}
