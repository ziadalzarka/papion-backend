import { ObjectID } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from 'app/reservation/reservation.schema';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';

@Injectable()
export class BusinessReservationService {
  constructor(@InjectModel('Reservation') private reservationModel: Model<Reservation>) { }

  async listReservations(serviceId: ObjectID, page: number, projection = {}) {
    return performPaginatableQuery(this.reservationModel, { service: serviceId }, { _id: -1 }, page, projection);
  }
}
