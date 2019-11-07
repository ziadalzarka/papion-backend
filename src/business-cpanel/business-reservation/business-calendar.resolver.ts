import { Resolver, Args } from '@nestjs/graphql';
import { ReservationService } from 'app/reservation/reservation.service';
import { Query } from '@nestjs/graphql';
import { ReservationEntity } from 'app/reservation/reservation.dto';
import { PlaceBusinessCalendarQueryInput, PersonBusinessCalendarQueryInput } from './business-reservation.dto';
import { AuthenticationScope } from 'app/user/token.interface';
import { AuthScopes } from 'app/user/scope.decorator';
import { ServiceService } from 'app/service/service.service';
import { User } from 'app/user/user.decorator';
import { IUser } from 'app/user';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'app/user/auth.guard';

@Resolver('BusinessCalendar')
export class BusinessCalendarResolver {

  constructor(private reservationService: ReservationService, private serviceService: ServiceService) { }

  @Query(returns => [ReservationEntity])
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.ManageReservations, AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinessCalendar(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => PlaceBusinessCalendarQueryInput }) payload: PlaceBusinessCalendarQueryInput) {
    await this.serviceService.validateServiceOwned(payload.serviceId, user._id);
    return await this.reservationService.listCalendarReservations(payload);
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
}
