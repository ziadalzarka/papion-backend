import { Resolver, Query, ResolveProperty, Parent, Args, Info, Mutation } from '@nestjs/graphql';
import { PlaceServiceEntity } from 'app/service/service.dto';
import { ReservationsPage, ReservationEntity } from 'app/reservation/reservation.dto';
import { IPlaceService } from 'app/service/service.schema';
import { GraphQLResolveInfo } from 'graphql';
import { BusinessReservationService } from './business-reservation.service';
import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { AuthenticationScope } from 'app/user/token.interface';
import { AuthScopes } from 'app/user/scope.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'app/user/auth.guard';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';
import { PlaceBusinessCalendarQueryInput, PlaceBusinessMarkCalendarInput } from './business-reservation.dto';
import { ReservationService } from 'app/reservation/reservation.service';
import { ServiceService } from 'app/service/service.service';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { ObjectID } from 'mongodb';
import { UserRequestsCannotBeDeletedException } from './exceptions/user-requests-cannot-be-deleted.exception';

@Resolver(of => PlaceServiceEntity)
export class PlaceBusinessReservationResolver {

  constructor(
    private businessReservationService: BusinessReservationService,
    private reservationService: ReservationService,
    private serviceService: ServiceService) { }

  @ResolveProperty('reservations', type => ReservationsPage)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async resolvePersonBusinessReservations(
    @Parent() placeService: IPlaceService,
    @Args({ name: 'page', type: () => Number }) page: number,
    @Info() info: GraphQLResolveInfo) {
    return await this.businessReservationService.listServiceReservations(placeService._id, page, graphqlMongodbProjection(info));
  }

  @Query(returns => [ReservationEntity])
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinessCalendar(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => PlaceBusinessCalendarQueryInput }) payload: PlaceBusinessCalendarQueryInput) {
    await this.serviceService.validateServiceOwned(payload.serviceId, user._id);
    return await this.reservationService.listCalendarReservations(payload);
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinessMarkCalendar(
    @Info() info,
    @User() user: IUser,
    @Args({ name: 'payload', type: () => PlaceBusinessMarkCalendarInput }) payload: PlaceBusinessMarkCalendarInput) {
    const service = await this.serviceService._resolveService(payload.serviceId);
    if (!user._id.equals(service.owner as ObjectID)) {
      throw new ServiceNotOwnedException();
    }
    return await this.businessReservationService.serviceMarkCalendar(service, payload, info);
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinessDeleteCalendarMark(
    @Info() info,
    @User() user: IUser,
    @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    return await this.reservationService.unmarkServiceCalendarDay(id, user._id, graphqlMongodbProjection(info));
  }
}
