import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { ReviewService } from './review.service';
import { Resolver, ResolveProperty, Args, Parent, Info } from '@nestjs/graphql';
import { ReviewEntity, ReviewEntityPage } from './review.dto';
import { PlaceServiceEntity } from 'app/service/service.dto';

@Resolver(of => PlaceServiceEntity)
export class PlaceBusinessReviewResolver {

  constructor(private reviewService: ReviewService) { }

  @ResolveProperty('reviews', returns => ReviewEntityPage)
  async reviews(
    @Parent() parent: ReviewEntity,
    @Info() info,
    @Args({ name: 'page', type: () => Number }) page: number) {
    return await this.reviewService.listReviews({ service: parent._id }, page, graphqlMongodbProjection(info));
  }
}
