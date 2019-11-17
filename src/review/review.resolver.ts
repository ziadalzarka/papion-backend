import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { ReviewCommentService } from './review-comment.service';
import { Resolver, Mutation, Args, ResolveProperty, Parent, Info } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { ReviewEntity, CreateReviewInput, UpdateReviewPayloadInput } from './review.dto';
import { ReviewCommentEntity, CreateReviewCommentInput, ReviewCommentEntityPage, UpdateReviewCommentPayloadInput } from './review-comment.dto';
import { ServiceService } from 'app/service/service.service';
import { AuthGuard } from 'app/user/auth.guard';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';
import { ObjectID } from 'mongodb';
import { ReviewNotOwnedException } from './exceptions/review-not-owned.exception';
import { ReviewCommentNotOwnedException } from './exceptions/review-comment-not-owned.exception';
import { UserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';

@Resolver(of => ReviewEntity)
export class ReviewResolver {

  constructor(
    private reviewService: ReviewService,
    private reviewCommentService: ReviewCommentService,
    private serviceService: ServiceService,
    private userService: UserService) { }

  @Mutation(returns => ReviewEntity)
  @UseGuards(AuthGuard)
  async postReview(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => CreateReviewInput }, new ValidationPipe()) payload: CreateReviewInput) {
    await this.serviceService.validateServicePublished(payload.service);
    await this.reviewService.validateReviewNotDuplicated({ service: payload.service, user: user._id });
    return await this.reviewService.createReview({ ...payload, user: user._id });
  }

  @Mutation(returns => ReviewEntity)
  @UseGuards(AuthGuard)
  async updateReview(
    @User() user: IUser,
    @Info() info,
    @Args({ name: 'payload', type: () => UpdateReviewPayloadInput }, new ValidationPipe()) payload: UpdateReviewPayloadInput) {
    const doc = await this.reviewService.findOne({ _id: payload.id }, { user: true });
    if (!user._id.equals(doc.user as ObjectID)) {
      throw new ReviewNotOwnedException();
    }
    return await this.reviewService.updateReview(payload.id, payload.data, graphqlMongodbProjection(info));
  }

  @Mutation(returns => ReviewEntity)
  @UseGuards(AuthGuard)
  async deleteReview(
    @User() user: IUser,
    @Info() info,
    @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    const doc = await this.reviewService.findOne({ _id: id }, { user: true });
    if (!user._id.equals(doc.user as ObjectID)) {
      throw new ReviewNotOwnedException();
    }
    return await this.reviewService.deleteReview(id, graphqlMongodbProjection(info));
  }

  @ResolveProperty('comments', returns => ReviewCommentEntityPage)
  async comments(
    @Parent() review: ReviewEntity,
    @Info() info,
    @Args({ name: 'page', type: () => Number }) page: number) {
    return await this.reviewCommentService.listReviewComments({ review: review._id }, page, graphqlMongodbProjection(info));
  }

  @ResolveProperty('user', returns => UserEntity)
  async user(
    @Parent() review: ReviewEntity,
    @Info() info) {
    return await this.userService._resolveUser(review.user as any);
  }
}
