import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { AuthGuard } from 'app/user/auth.guard';
import { ReservationService } from './reservation.service';
import { Resolver, Mutation, Args, Query, ResolveProperty, Parent, Info } from '@nestjs/graphql';
import { ReserveServiceInput, ReservationEntity, ReservationsPage, ReservationStatus } from './reservation.dto';
import { ServiceService } from 'app/service/service.service';
import { UseGuards } from '@nestjs/common';
import { ResolveUser } from 'app/user/resolve-user.decorator';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';
import { ServiceEntity } from 'app/service/service.dto';
import { IReservation } from './reservation.schema';
import { ObjectID } from 'mongodb';
import { groundDate } from 'app/shared/date.util';
import { ReservationDayPassedException } from './exceptions/reservation-day-passed.exception';
import { ClientUserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';
@Resolver(of => ReservationEntity)
export class ReservationResolver {

  constructor(
    private reservationService: ReservationService,
    private serviceService: ServiceService,
    private userService: UserService) { }

  // TODO: authentication scopes
  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  async submitRequest(@User() user: IUser, @Args({ name: 'payload', type: () => ReserveServiceInput }) payload: ReserveServiceInput) {
    payload.reservationDay = groundDate(payload.reservationDay);
    if (groundDate(new Date()) > payload.reservationDay) {
      throw new ReservationDayPassedException();
    }
    await this.serviceService.validateServicePublished(payload.service);
    await this.reservationService.validateRequestNotDuplicated({
      reservationDay: payload.reservationDay,
      service: payload.service,
    });
    return await this.reservationService.submitRequest({ ...payload, client: user._id });
  }

  // TODO: authentication scopes
  @Query(returns => ReservationsPage)
  @UseGuards(AuthGuard)
  @ResolveUser()
  async reservations(@User() user: IUser, @Args({ name: 'page', type: () => Number, nullable: true }) page?: number) {
    return await this.reservationService.listReservations(user._id, page);
  }

  @ResolveProperty('service', type => ServiceEntity)
  async service(@Parent() reservation: IReservation, @Info() info) {
    return await this.serviceService._resolveService(reservation.service as ObjectID, graphqlMongodbProjection(info));
  }

  @ResolveProperty('client', type => ClientUserEntity)
  async client(@Parent() reservation: IReservation, @Info() info) {
    return await this.userService._resolveUser(reservation.client as ObjectID, graphqlMongodbProjection(info));
  }

}
