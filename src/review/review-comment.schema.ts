import * as mongoose from 'mongoose';
import { buildSchema, field, schema } from 'mongoose-schema-decorators';
import { ObjectID } from 'mongodb';
import { User } from 'app/user';
import { Review } from './review.schema';

@schema({})
export class IReviewComment {
  @field
  body: string;
  @field({ ref: 'User' })
  user: User | ObjectID;
  @field({ ref: 'Review' })
  review: Review | ObjectID;
}

export const ReviewCommentSchema = buildSchema(IReviewComment);

mongoose.model('ReviewComment', ReviewCommentSchema);

export type ReviewComment = IReviewComment & mongoose.Document;
