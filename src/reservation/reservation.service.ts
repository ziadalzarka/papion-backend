import { ObjectID } from 'bson';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, IReservation } from './reservation.schema';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ReservationDuplicatedException } from './exceptions/reservation-duplicated.exception';
import { ReservationStatus } from './reservation.dto';
import { GraphQLResolveInfo } from 'graphql';
import { IService } from 'app/service/service.schema';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { InvalidReservationStatusTransitionException } from './exceptions/invalid-status-transition.exception';
import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { ReservationNotOwnedException } from './exceptions/reservation-not-owned.exception';
import { BusinessCalendarQueryInput } from 'app/business-cpanel/business-reservation/business-reservation.dto';

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
    return await performPaginatableQuery(this.reservationModel, { client: userId }, { _id: -1 }, page, projection);
  }

  async listCalendarReservations(query: BusinessCalendarQueryInput) {
    return await this.reservationModel.find({
      service: query.serviceId,
      ...query.statuses && { status: { $in: query.statuses } },
      $and: [
        { reservationDay: { $gte: query.from } },
        { reservationDay: { $lte: query.to } },
      ],
    }).sort({ reservationDay: -1 });
  }

  async updateReservation(id: ObjectID, payload: Partial<IReservation>, projection = {}) {
    return await this.reservationModel.findByIdAndUpdate(id, payload, { select: projection, new: true });
  }

  async _resolveReservation(id: ObjectID, projection = {}) {
    return await this.reservationModel.findById(id, projection);
  }

  async clientChangeReservationStatus(
    clientId: ObjectID,
    oldStatus: ReservationStatus,
    { _id, ...payload }: Partial<IReservation>,
    projection = {}) {
    const reservation = await this.reservationModel.findById(_id, { status: true, client: true });
    if (!clientId.equals(reservation.client as ObjectID)) {
      throw new ReservationNotOwnedException();
    }
    if (reservation.status !== oldStatus) {
      throw new InvalidReservationStatusTransitionException();
    }
    return await this.updateReservation(_id, payload, projection);
  }
}
