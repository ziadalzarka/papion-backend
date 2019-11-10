import { Resolver } from '@nestjs/graphql';
import { ReservationService } from 'app/reservation/reservation.service';
import { ServiceService } from 'app/service/service.service';

@Resolver('BusinessCalendar')
export class BusinessCalendarResolver {

  constructor(private reservationService: ReservationService, private serviceService: ServiceService) { }
}
