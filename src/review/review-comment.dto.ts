import { DatabaseEntity } from '@gray/graphql-essentials';
import { Field, InputType, ObjectType } from 'type-graphql';
import { UserEntity } from 'app/user/user.dto';
import { ReviewEntity } from './review.dto';
import { ObjectID } from 'mongodb';
import { ResultsPage } from '@gray/graphql-essentials/page.dto';

@ObjectType()
export class ReviewCommentEntity extends DatabaseEntity {
  @Field()
  body: string;
  @Field(type => UserEntity)
  user: typeof UserEntity;
}

@InputType()
export class CreateReviewCommentInput {
  @Field()
  body: string;
  @Field(type => ObjectID)
  review: ObjectID;
}

@ObjectType()
export class ReviewCommentEntityPage extends ResultsPage<ReviewCommentEntity> {
  @Field(type => [ReviewCommentEntity])
  edges: ReviewCommentEntity[];
  @Field()
  pages: number;
  @Field()
  hasNext: boolean;
}

@InputType()
export class UpdateReviewCommentInput {
  @Field()
  body: string;
}

@InputType()
export class UpdateReviewCommentPayloadInput {
  @Field(type => ObjectID)
  id: ObjectID;
  @Field(type => UpdateReviewCommentInput)
  data: UpdateReviewCommentInput;
}
