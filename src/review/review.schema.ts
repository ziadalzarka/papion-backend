import * as mongoose from 'mongoose';
import { buildSchema, field, schema, indexed } from 'mongoose-schema-decorators';
import { ObjectID } from 'mongodb';
import { User } from 'app/user';
import { Service } from 'app/service/service.schema';

@schema({})
export class IReview {
  @field
  body: string;
  @indexed
  @field
  rating: number;
  @field({ ref: 'User' })
  user: User | ObjectID;
  @indexed
  @field({ ref: 'Service' })
  service: Service | ObjectID;
}

export const ReviewSchema = buildSchema(IReview);

mongoose.model('Review', ReviewSchema);

export type Review = IReview & mongoose.Document;
