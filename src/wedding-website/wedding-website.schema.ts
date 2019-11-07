import { ObjectID } from 'bson';
import { schema, field, buildSchema, unique, indexed } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { WeddingWebsiteData, WeddingWebsiteInput, WeddingWebsiteEntity } from './wedding-website.dto';
import { User } from 'app/user/user.schema';
import { Template } from 'app/template/template.schema';
import { IPlaceService } from 'app/service/service.schema';

@schema({})
export class IWeddingWebsite {
  @field
  @unique
  @indexed
  subdomain: string;
  @field
  data: WeddingWebsiteData;
  @field({ ref: 'Template' })
  template: Template | ObjectID;
  @field({ ref: 'User' })
  user: User | ObjectID;
  @field({ ref: 'PlaceService' })
  venue: IPlaceService | ObjectID;
}

export const WeddingWebsiteSchema = buildSchema(IWeddingWebsite);

mongoose.model('WeddingWebsite', WeddingWebsiteSchema);

export type WeddingWebsite = IWeddingWebsite & mongoose.Document;
