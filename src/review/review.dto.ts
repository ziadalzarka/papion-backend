import { ResultsPage } from '@gray/graphql-essentials/page.dto';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { Field, InputType, ObjectType } from 'type-graphql';
import { UserEntity } from 'app/user/user.dto';
import { ServiceEntity } from 'app/service/service.dto';
import { ReviewCommentEntity, ReviewCommentEntityPage } from './review-comment.dto';
import { ObjectID } from 'bson';
import { IsNumber, Max, Min } from 'class-validator';

@ObjectType()
export class ReviewEntity extends DatabaseEntity {
  @Field()
  body: string;
  @Field()
  rating: number;
  @Field(type => UserEntity)
  user: typeof UserEntity;
  @Field(type => ServiceEntity)
  service: typeof ServiceEntity;
  @Field(type => ReviewCommentEntityPage)
  comments: ReviewCommentEntityPage;
}

@InputType()
export class CreateReviewInput {
  @Field({ nullable: true })
  body?: string;
  @Min(1)
  @Max(5)
  @IsNumber()
  @Field({ nullable: true })
  rating?: number;
  @Field(type => ObjectID)
  service: ObjectID;
}

@ObjectType()
export class ReviewEntityPage extends ResultsPage<ReviewEntity> {
  @Field(type => [ReviewEntity])
  edges: ReviewEntity[];
  @Field()
  pages: number;
  @Field()
  hasNext: boolean;
}
