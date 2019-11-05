import { Module } from '@nestjs/common';
import { BusinessReservationModule } from './business-reservation/business-reservation.module';

@Module({
  imports: [BusinessReservationModule],
})
export class BusinessCpanelModule { }
