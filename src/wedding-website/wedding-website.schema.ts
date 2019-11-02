import { ObjectID } from 'bson';
import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { WeddingWebsiteData, WeddingWebsiteInput, WeddingWebsiteEntity } from './wedding-website.dto';
import { User } from '@gray/user-module/user.schema';
import { Template } from 'app/template/template.schema';

@schema({})
export class IWeddingWebsite {
  @field
  @unique
  subdomain: string;
  @field
  data: WeddingWebsiteData;
  @field({ ref: 'Template' })
  template: Template | ObjectID;
  @field({ ref: 'User' })
  user: User | ObjectID;
}

export const WeddingWebsiteSchema = buildSchema(IWeddingWebsite);

mongoose.model('WeddingWebsite', WeddingWebsiteSchema);

export type WeddingWebsite = IWeddingWebsite & mongoose.Document;

export abstract class IQuery {
  abstract createWeddingWebsite(payload: WeddingWebsiteInput): WeddingWebsiteEntity;
}
