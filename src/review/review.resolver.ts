import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { ReviewCommentService } from './review-comment.service';
import { Resolver, Mutation, Args, ResolveProperty, Parent, Info } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { ReviewEntity, CreateReviewInput } from './review.dto';
import { ReviewCommentEntity, CreateReviewCommentInput, ReviewCommentEntityPage } from './review-comment.dto';
import { ServiceService } from 'app/service/service.service';
import { AuthGuard } from 'app/user/auth.guard';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';

@Resolver(of => ReviewEntity)
export class ReviewResolver {

  constructor(
    private reviewService: ReviewService,
    private reviewCommentService: ReviewCommentService,
    private serviceService: ServiceService) { }

  @Mutation(returns => ReviewEntity)
  @UseGuards(AuthGuard)
  async postReview(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => CreateReviewInput }, new ValidationPipe()) payload: CreateReviewInput) {
    await this.serviceService.validateServicePublished(payload.service);
    return await this.reviewService.createReview({ ...payload, user: user._id });
  }

  @Mutation(returns => ReviewCommentEntity)
  @UseGuards(AuthGuard)
  async postReviewComment(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => CreateReviewCommentInput }) payload: CreateReviewCommentInput) {
    await this.reviewService.validateReviewExists(payload.review);
    return await this.reviewCommentService.createReviewComment({ ...payload, user: user._id });
  }

  @ResolveProperty('comments', returns => ReviewCommentEntityPage)
  async comments(
    @Parent() review: ReviewEntity,
    @Info() info,
    @Args({ name: 'page', type: () => Number }) page: number) {
    return await this.reviewCommentService.listReviewComments({ review: review._id }, page, graphqlMongodbProjection(info));
  }
}
