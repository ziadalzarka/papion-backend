import { Service } from 'app/service/service.schema';
import { User } from 'app/user/user.schema';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, schema } from 'mongoose-schema-decorators';
import { ReservationStatus } from './reservation.dto';
import { statusStringToNumber, statusNumberToString } from './reservation.util';

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

// convert string enum to numbers for sort
ReservationSchema.pre('save', function (next) {
  if ((this as any).status) {
    (this as any).status = statusStringToNumber((this as any).status);
  }
  next();
});

ReservationSchema.post('save', function (doc: any, next) {
  doc.status = statusNumberToString(doc.status);
  next();
});

// convert number enum back to strings
ReservationSchema.post('find', (docs: any) => {
  for (const doc of docs) {
    doc.status = statusNumberToString(doc.status);
  }
});

mongoose.model('Reservation', ReservationSchema);

export type Reservation = IReservation & mongoose.Document;
