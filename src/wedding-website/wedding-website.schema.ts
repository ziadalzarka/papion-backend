import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { WeddingWebsiteData, WeddingWebsiteInput, WeddingWebsiteEntity } from './wedding-website.dto';
import { User } from '@gray/user-module/user.schema';

@schema({})
export class IWeddingWebsite {
  @field
  @unique
  subdomain: string;
  @field
  data: WeddingWebsiteData;
  @field({ ref: 'User' })
  user: User;
}

export const WeddingWebsiteSchema = buildSchema(IWeddingWebsite);

mongoose.model('WeddingWebsite', WeddingWebsiteSchema);

export type WeddingWebsite = IWeddingWebsite & mongoose.Document;

export abstract class IQuery {
  abstract createWeddingWebsite(payload: WeddingWebsiteInput): WeddingWebsiteEntity;
}