import { ObjectID } from 'bson';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, IReservation } from './reservation.schema';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ReservationDuplicatedException } from './exceptions/reservation-duplicated.exception';

@Injectable()
export class ReservationService {

  constructor(@InjectModel('Reservation') private reservationModel: Model<Reservation>) { }

  async submitRequest(payload: Partial<IReservation>) {
    return await new this.reservationModel(payload).save();
  }

  async validateRequestNotDuplicated(payload: Partial<IReservation>) {
    const exists = await this.reservationModel.exists(payload);
    if (exists) {
      throw new ReservationDuplicatedException();
    }
  }

  async listReservations(userId: ObjectID, page, projection = {}) {
    return await performPaginatableQuery(this.reservationModel, { user: userId }, { _id: -1 }, page, projection);
  }
}
