import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceModule } from 'app/service/service.module';
import { UserModule } from 'app/user';
import { ReservationResolver } from './reservation.resolver';
import { ReservationSchema } from './reservation.schema';
import { ReservationService } from './reservation.service';
import { NotificationModule } from 'app/notification/notification.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Reservation', schema: ReservationSchema }]),
    ServiceModule,
    NotificationModule,
  ],
  providers: [ReservationService, ReservationResolver],
  exports: [MongooseModule, ReservationService],
})
export class ReservationModule { }
