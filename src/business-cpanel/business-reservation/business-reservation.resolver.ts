import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  ReservationEntity,
  ReservationStatus,
  PlaceBusinessReservationEntity,
  PlaceBusinessReservationEntityPage,
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

@Resolver('BusinessReservation')
export class BusinessReservationResolver {

  constructor(private businessReservationService: BusinessReservationService, private notificationService: NotificationService) { }

  @Query(returns => PlaceBusinessReservationEntityPage)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinessReservations(@User() user: IUser, @Args({ name: 'page', type: () => Number }) page: number, @Info() info) {
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
      status: ReservationStatus.Reserved,
    }, graphqlMongodbProjection(info));
  }

}
