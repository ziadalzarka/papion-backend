import { Module } from '@nestjs/common';
import { BusinessReservationService } from 'app/business-cpanel/business-reservation/business-reservation.service';
import { ReservationModule } from 'app/reservation/reservation.module';
import { PersonBusinessReservationResolver } from './person-business-reservation.resolver';
import { PlaceBusinessReservationResolver } from './place-business-reservation.resolver';
import { ServiceModule } from 'app/service/service.module';
import { UserModule } from 'app/user';
import { BusinessReservationResolver } from './business-reservation.resolver';
import { BusinessCalendarResolver } from 'app/business-cpanel/business-reservation/business-calendar.resolver';

@Module({
  imports: [
    ReservationModule,
    ServiceModule,
    UserModule,
  ],
  providers: [
    BusinessReservationService,
    PersonBusinessReservationResolver,
    PlaceBusinessReservationResolver,
    BusinessReservationResolver,
    BusinessCalendarResolver,
  ],
})
export class BusinessReservationModule { }
