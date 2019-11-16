import { Resolver, ResolveProperty, Parent, Info, Mutation, Args } from '@nestjs/graphql';
import { ReviewCommentEntity, UpdateReviewCommentPayloadInput, CreateReviewCommentInput } from './review-comment.dto';
import { UserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'app/user/auth.guard';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';
import { ObjectID } from 'bson';
import { ReviewCommentNotOwnedException } from './exceptions/review-comment-not-owned.exception';
import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { ReviewCommentService } from './review-comment.service';
import { ReviewService } from './review.service';

@Resolver(of => ReviewCommentEntity)
export class ReviewCommentResolver {

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private reviewCommentService: ReviewCommentService) { }

  @Mutation(returns => ReviewCommentEntity)
  @UseGuards(AuthGuard)
  async postReviewComment(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => CreateReviewCommentInput }) payload: CreateReviewCommentInput) {
    await this.reviewService.validateReviewExists({ _id: payload.review });
    return await this.reviewCommentService.createReviewComment({ ...payload, user: user._id });
  }

  @Mutation(returns => ReviewCommentEntity)
  @UseGuards(AuthGuard)
  async updateReviewComment(
    @User() user: IUser,
    @Info() info,
    @Args({ name: 'payload', type: () => UpdateReviewCommentPayloadInput }) payload: UpdateReviewCommentPayloadInput) {
    const doc = await this.reviewCommentService.findOne({ _id: payload.id }, { user: true });
    if (!user._id.equals(doc.user as ObjectID)) {
      throw new ReviewCommentNotOwnedException();
    }
    return await this.reviewCommentService.updateReviewComment(payload.id, payload.data, graphqlMongodbProjection(info));
  }

  @Mutation(returns => ReviewCommentEntity)
  @UseGuards(AuthGuard)
  async deleteReviewComment(
    @User() user: IUser,
    @Info() info,
    @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    const doc = await this.reviewCommentService.findOne({ _id: id }, { user: true });
    if (!user._id.equals(doc.user as ObjectID)) {
      throw new ReviewCommentNotOwnedException();
    }
    return await this.reviewCommentService.deleteReviewComment(id, graphqlMongodbProjection(info));
  }

  @ResolveProperty('user', returns => UserEntity)
  async user(
    @Parent() review: ReviewCommentEntity,
    @Info() info) {
    return await this.userService._resolveUser(review.user as any);
  }
}
