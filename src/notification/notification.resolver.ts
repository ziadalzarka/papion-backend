import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { Resolver, Subscription, ResolveProperty, Parent, Info, Query, Args, Mutation } from '@nestjs/graphql';
import { NotificationEntity, NotificationData, NotificationEntityPage, RequiredNotificationProjection } from './notification.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { NotificationType } from './notification-type.dto';
import { WeddingWebsiteService } from 'app/wedding-website/wedding-website.service';
import { ReservationService } from 'app/reservation/reservation.service';
import { GraphQLResolveInfo } from 'graphql';
import { AuthGuard } from 'app/user/auth.guard';
import { NotificationService } from './notification.service';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';
import { ObjectID } from 'mongodb';

@Resolver(of => NotificationEntity)
export class NotificationResolver {

  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    private wedingWebsiteService: WeddingWebsiteService,
    private reservationService: ReservationService,
    private notificationService: NotificationService) { }

  @ResolveProperty('data', returns => NotificationData)
  async data(@Parent() parent: NotificationEntity, @Info() info: GraphQLResolveInfo) {
    const projection = {
      ...RequiredNotificationProjection,
      ...graphqlMongodbProjection(info),
    };
    switch (parent.notificationType) {
      case NotificationType.WeddingWebsiteCreated:
        return await this.wedingWebsiteService._resolveWeddingWebsite(parent.dataRef, projection);
      case NotificationType.BusinessRepliedToReservation:
        return await this.reservationService._resolveReservation(parent.dataRef, projection);
    }
  }

  @Query(returns => NotificationEntityPage)
  @UseGuards(AuthGuard)
  async notifications(@User() user: IUser, @Args({ name: 'page', type: () => Number }) page: number, @Info() info) {
    return await this.notificationService.listNotifications(user._id, page, graphqlMongodbProjection(info));
  }

  @Mutation(returns => Boolean)
  @UseGuards(AuthGuard)
  async markAsSeen(@Args({ name: 'last', type: () => ObjectID }) last: ObjectID) {
    await this.notificationService.markAsSeen(last);
    return true;
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
