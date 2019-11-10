import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ReservationEntity, ReservationsPage } from 'app/reservation/reservation.dto';
import { ReservationService } from 'app/reservation/reservation.service';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { PersonServiceEntity } from 'app/service/service.dto';
import { IPersonService } from 'app/service/service.schema';
import { ServiceService } from 'app/service/service.service';
import { IUser } from 'app/user';
import { AuthGuard } from 'app/user/auth.guard';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { User } from 'app/user/user.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectID } from 'mongodb';
import { PersonBusinessCalendarQueryInput, ServiceMarkCalendarInput } from './business-reservation.dto';
import { BusinessReservationService } from './business-reservation.service';
import { UserRequestsCannotBeDeletedException } from './exceptions/user-requests-cannot-be-deleted.exception';

@Resolver(of => PersonServiceEntity)
export class PersonBusinessReservationResolver {

  constructor(
    private businessReservationService: BusinessReservationService,
    private reservationService: ReservationService,
    private serviceService: ServiceService) { }

  @ResolveProperty('reservations', type => ReservationsPage)
  @AuthScopes([AuthenticationScope.ManageReservations])
  async personBusinessReservations(
    @Parent() personService: IPersonService,
    @Args({ name: 'page', type: () => Number }) page: number,
    @Info() info: GraphQLResolveInfo) {
    return await this.businessReservationService.listServiceReservations(personService._id, page, graphqlMongodbProjection(info));
  }

  @Query(returns => [ReservationEntity])
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPersonBusiness])
  async personBusinessCalendar(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => PersonBusinessCalendarQueryInput }) payload: PersonBusinessCalendarQueryInput) {
    const service = await this.serviceService._resolvePersonService(user._id);
    return await this.reservationService.listCalendarReservations({ serviceId: service._id, ...payload });
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPersonBusiness])
  async personBusinessMarkCalendar(
    @Info() info,
    @User() user: IUser,
    @Args({ name: 'payload', type: () => ServiceMarkCalendarInput }) payload: ServiceMarkCalendarInput) {
    const service = await this.serviceService._resolvePersonService(user._id);
    return await this.businessReservationService.serviceMarkCalendar(service, payload, info);
  }

  @Mutation(returns => ReservationEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPersonBusiness])
  async personBusinessDeleteCalendarMark(
    @Info() info,
    @User() user: IUser,
    @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    return await this.reservationService.unmarkServiceCalendarDay(id, user._id, graphqlMongodbProjection(info));
  }
}
