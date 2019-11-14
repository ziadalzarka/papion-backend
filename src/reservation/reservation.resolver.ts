import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ServiceEntity } from 'app/service/service.dto';
import { ServiceService } from 'app/service/service.service';
import { groundDate } from 'app/shared/date.util';
import { IUser } from 'app/user';
import { AuthGuard } from 'app/user/auth.guard';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { User } from 'app/user/user.decorator';
import { ClientUserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';
import { ObjectID } from 'mongodb';
import { ReservationDayPassedException } from './exceptions/reservation-day-passed.exception';
import { ReservationEntity, ReservationsPage, ReserveServiceInput, ReservationStatus } from './reservation.dto';
import { IReservation } from './reservation.schema';
import { ReservationService } from './reservation.service';
@Resolver(of => ReservationEntity)
export class ReservationResolver {

  constructor(
    private reservationService: ReservationService,
    private serviceService: ServiceService,
    private userService: UserService) { }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.Reserve])
  async submitReservationRequest(@User() user: IUser, @Args({ name: 'payload', type: () => ReserveServiceInput }) payload: ReserveServiceInput) {
    payload.reservationDay = groundDate(payload.reservationDay);
    if (groundDate(new Date()) > payload.reservationDay) {
      throw new ReservationDayPassedException();
    }
    const { acceptsMultiple, owner } = await this.serviceService.validateServicePublished(payload.service, { owner: true });
    if (!acceptsMultiple) {
      await this.reservationService.validateRequestNotDuplicated({
        reservationDay: payload.reservationDay,
        service: payload.service,
        status: ReservationStatus.Reserved,
      });
    }
    const doc = await this.reservationService.createReservation({ ...payload, client: user._id, businessOwner: owner });
    await this.reservationService.notifyBusinessReservationChange(doc);
    return doc;
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.Reserve])
  async clientRefuseReservation(@User() user: IUser, @Info() info, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    const doc = await this.reservationService.clientChangeReservationStatus(user._id, ReservationStatus.Responded, {
      _id: id,
      status: ReservationStatus.ClientRefused,
    });
    await this.reservationService.notifyBusinessReservationChange(doc);
    return doc;
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.Reserve])
  async clientApproveReservation(@User() user: IUser, @Info() info, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    const doc = await this.reservationService.clientChangeReservationStatus(user._id, ReservationStatus.Responded, {
      _id: id,
      status: ReservationStatus.PendingConfirmation,
    });
    await this.reservationService.notifyBusinessReservationChange(doc);
    return doc;
  }

  @Query(returns => ReservationsPage)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.Reserve])
  async reservations(@User() user: IUser, @Info() info, @Args({ name: 'page', type: () => Number, nullable: true }) page?: number) {
    return await this.reservationService.listReservations(user._id, page, graphqlMongodbProjection(info));
  }

  @ResolveProperty('service', type => ServiceEntity)
  async service(@Parent() reservation: IReservation, @Info() info) {
    return await this.serviceService._resolveService(reservation.service as ObjectID, graphqlMongodbProjection(info));
  }

  @ResolveProperty('client', type => ClientUserEntity)
  async client(@Parent() reservation: IReservation, @Info() info) {
    if (reservation.client) {
      return await this.userService._resolveUser(reservation.client as ObjectID, graphqlMongodbProjection(info));
    } else {
      return null;
    }
  }

}
