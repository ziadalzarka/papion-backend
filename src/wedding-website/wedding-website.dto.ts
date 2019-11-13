import { ObjectType, Field, InputType, ID } from 'type-graphql';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { ClientUserEntity } from 'app/user/user.dto';
import { File } from '@gray/graphql-essentials';
import { ObjectID } from 'mongodb';
import { TemplateEntity } from 'app/template/template.dto';

@ObjectType()
export class WeddingWebsiteData {
  @Field()
  coupleName: string;
  @Field(type => File, { nullable: true })
  image?: string;
  @Field({ nullable: true })
  description?: string;
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
  @Field(type => TemplateEntity)
  template: TemplateEntity;
}

@InputType()
export class WeddingWebsiteDataInput {
  @Field()
  coupleName: string;
  @Field(type => File, { nullable: true })
  image?: string;
  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class WeddingWebsiteInput {
  @Field()
  subdomain: string;
  @Field(type => WeddingWebsiteDataInput)
  data: WeddingWebsiteDataInput;
  @Field(type => ObjectID)
  templateId: ObjectID;
  @Field(type => ObjectID)
  reservationId: ObjectID;
}

@InputType()
export class UpdateWeddingWebsiteDataInput {
  @Field({ nullable: true })
  coupleName?: string;
  @Field(type => File, { nullable: true })
  image?: string;
  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateWeddingWebsiteInput {
  @Field(type => WeddingWebsiteDataInput)
  data: WeddingWebsiteDataInput;
  @Field(type => ObjectID, { nullable: true })
  templateId?: ObjectID;
}

@InputType()
export class UpdateWeddingWebsitePayloadInput {
  @Field()
  id: ObjectID;
  @Field(type => UpdateWeddingWebsiteInput)
  data: UpdateWeddingWebsiteInput;
}
