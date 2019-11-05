import { ReservationSchema } from './reservation.schema';
import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceModule } from 'app/service/service.module';
import { UserModule } from 'app/user';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Reservation', schema: ReservationSchema }]),
    ServiceModule,
  ],
  providers: [ReservationService, ReservationResolver],
  exports: [MongooseModule],
})
export class ReservationModule { }
