import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { Resolver, Subscription, ResolveProperty, Parent, Info } from '@nestjs/graphql';
import { NotificationEntity, NotificationData } from './notification.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NotificationType } from './notification-type.dto';
import { WeddingWebsiteService } from 'app/wedding-website/wedding-website.service';
import { ReservationService } from 'app/reservation/reservation.service';
import { GraphQLResolveInfo } from 'graphql';
import { AuthGuard } from 'app/user/auth.guard';

@Resolver(of => NotificationEntity)
export class NotificationResolver {

  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    private wedingWebsiteService: WeddingWebsiteService,
    private reservationService: ReservationService) { }

  @ResolveProperty('data', returns => NotificationData)
  async data(@Parent() parent: NotificationEntity, @Info() info: GraphQLResolveInfo) {
    switch (parent.notificationType) {
      case NotificationType.WeddingWebsiteCreated:
        return await this.wedingWebsiteService._resolveWeddingWebsite(parent.dataRef, graphqlMongodbProjection(info));
      case NotificationType.PapionUserSubmittedReservationRequest:
      case NotificationType.BusinessRepliedToReservation:
        return await this.reservationService._resolveReservation(parent.dataRef, graphqlMongodbProjection(info));
    }
  }

  @Subscription(returns => NotificationEntity, {
    filter: (payload, variables, context) => payload.user.equals(context.meta.user._id),
    resolve: data => data,
  })
  @UseGuards(AuthGuard)
  notificationReceived() {
    return this.pubSub.asyncIterator('notificationReceived');
  }

}
