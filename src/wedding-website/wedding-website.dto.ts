import { ObjectType, Field, InputType } from 'type-graphql';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { ClientUserEntity } from '@gray/user-module/user.dto';
import { File } from '@gray/graphql-essentials';

@ObjectType()
export class WeddingWebsiteData {
  @Field()
  coupleName: string;
  @Field(type => File)
  image: string;
  @Field()
  description: string;
}

@ObjectType()
export class WeddingWebsiteEntity extends DatabaseEntity {
  @Field()
  subdomain: string;
  @Field(type => WeddingWebsiteData)
  data: WeddingWebsiteData;
  @Field(type => ClientUserEntity)
  user: ClientUserEntity;
  @Field()
  href: string;
}

@InputType()
export class WeddingWebsiteDataInput {
  @Field()
  coupleName: string;
  @Field(type => File)
  image: string;
  @Field()
  description: string;
}

@InputType()
export class WeddingWebsiteInput {
  @Field()
  subdomain: string;
  @Field(type => WeddingWebsiteDataInput)
  data: WeddingWebsiteDataInput;
}
