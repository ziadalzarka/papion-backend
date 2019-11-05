import { Service } from 'app/service/service.schema';
import { User } from 'app/user/user.schema';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, schema } from 'mongoose-schema-decorators';
import { ReservationStatus } from './reservation.dto';

@schema({})
export class IReservation {
  @field({ ref: 'Service' })
  service: Service | ObjectID;
  @field
  reservationDay: Date;
  @field
  notes: string;
  @field({ default: ReservationStatus.Pending })
  status: ReservationStatus;
  @field({ ref: 'User' })
  user: User | ObjectID;
}

export const ReservationSchema = buildSchema(IReservation);

mongoose.model('Reservation', ReservationSchema);

export type Reservation = IReservation & mongoose.Document;
