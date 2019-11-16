import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { UseGuards, Inject } from '@nestjs/common';
import { Args, Info, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import {
  ReservationEntity,
  ReservationStatus,
  PlaceBusinessReservationEntity,
  PlaceBusinessReservationEntityPage,
  ReservationsPage,
} from 'app/reservation/reservation.dto';
import { ReservationService } from 'app/reservation/reservation.service';
import { IUser } from 'app/user';
import { AuthGuard } from 'app/user/auth.guard';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { User } from 'app/user/user.decorator';
import { ObjectID } from 'mongodb';
import { RespondToReservationInput } from './business-reservation.dto';
import { BusinessReservationService } from './business-reservation.service';
import { NotificationService } from 'app/notification/notification.service';
import { NotificationType } from 'app/notification/notification-type.dto';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { ServiceService } from 'app/service/service.service';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { IReservation } from 'app/reservation/reservation.schema';

@Resolver('BusinessReservation')
export class BusinessReservationResolver {

  constructor(
    private serviceService: ServiceService,
    private businessReservationService: BusinessReservationService,
    private notificationService: NotificationService,
    @Inject('PUB_SUB') private pubSub: PubSub) { }

  @Query(returns => ReservationsPage)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async businessReservations(@User() user: IUser, @Args({ name: 'page', type: () => Number }) page: number, @Info() info) {
    return await this.businessReservationService.listAllReservations(user._id, page, graphqlMongodbProjection(info));
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async businessRespondToReservation(
    @Args({ name: 'payload', type: () => RespondToReservationInput }) payload: RespondToReservationInput,
    @User() user: IUser,
    @Info() info) {
    const doc = await this.businessReservationService.businessChangeReservationStatus(user._id, ReservationStatus.Pending, {
      _id: payload.id,
      status: ReservationStatus.Responded,
      response: payload.data,
    }, { client: true, ...graphqlMongodbProjection(info) });
    await this.notificationService.createNotification({
      dataRef: doc._id,
      notificationType: NotificationType.BusinessRepliedToReservation,
      user: doc.client,
    });
    return doc;
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async businessRefuseReservation(
    @Args({ name: 'id', type: () => ObjectID }) _id: ObjectID,
    @User() user: IUser,
    @Info() info) {
    return await this.businessReservationService.businessChangeReservationStatus(user._id, ReservationStatus.Pending, {
      _id,
      status: ReservationStatus.BusinessRefused,
    }, graphqlMongodbProjection(info));
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async businessConfirmReservation(
    @Args({ name: 'id', type: () => ObjectID }) _id: ObjectID,
    @User() user: IUser,
    @Info() info) {
    return await this.businessReservationService.businessChangeReservationStatus(user._id, ReservationStatus.PendingConfirmation, {
      _id,
      status: ReservationStatus.Reserved,
    }, graphqlMongodbProjection(info));
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async businessCancelReservation(
    @Args({ name: 'id', type: () => ObjectID }) _id: ObjectID,
    @User() user: IUser,
    @Info() info) {
    return await this.businessReservationService.businessChangeReservationStatus(user._id, ReservationStatus.Reserved, {
      _id,
      status: ReservationStatus.Canceled,
    }, graphqlMongodbProjection(info));
  }

  @Subscription(returns => ReservationEntity, {
    resolve: data => data,
  })
  @UseGuards(AuthGuard)
  async reservationChanges(
    @User() user: IUser,
    @Args({ name: 'services', type: () => [ObjectID], nullable: true }) services?: ObjectID[]) {
    let filterIds = [];
    if (services) {
      const count = await this.serviceService.count({ _id: { $in: services } });
      if (count !== services.length) {
        throw new ServiceNotOwnedException();
      }
      filterIds = services.map(serviceId => serviceId.toHexString());
    } else {
      const ownedServices = await this.serviceService.find({ owner: user._id }, { _id: true });
      filterIds = ownedServices.map(service => service._id.toHexString());
    }
    return withFilter(
      () => this.pubSub.asyncIterator('reservationChanges'),
      (payload: IReservation) => filterIds.includes((payload.service as ObjectID).toHexString()),
    )();
  }

}
