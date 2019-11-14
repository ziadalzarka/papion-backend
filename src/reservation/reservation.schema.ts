import { Service } from 'app/service/service.schema';
import { User } from 'app/user/user.schema';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, indexed, schema } from 'mongoose-schema-decorators';
import { ReservationResponse, ReservationStatus } from './reservation.dto';

@schema({})
export class IReservation {
  _id: ObjectID;
  @indexed
  @field({ ref: 'Service' })
  service: Service | ObjectID;
  @indexed
  @field
  reservationDay: Date;
  @field
  notes: string;
  @indexed
  @field({ default: ReservationStatus.Pending })
  status: ReservationStatus;
  @indexed
  @field({ ref: 'User' })
  client: User | ObjectID;
  @indexed
  @field({ default: () => new Date() })
  addedAt: Date;
  @field
  response: ReservationResponse;
  @field({ ref: 'User' })
  businessOwner: User | ObjectID;
}

export const ReservationSchema = buildSchema(IReservation);

mongoose.model('Reservation', ReservationSchema);

export type Reservation = IReservation & mongoose.Document;
