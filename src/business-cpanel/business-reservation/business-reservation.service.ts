import { ObjectID } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, IReservation } from 'app/reservation/reservation.schema';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ReservationStatus } from 'app/reservation/reservation.dto';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { InvalidReservationStatusTransitionException } from 'app/reservation/exceptions/invalid-status-transition.exception';
import { ReservationService } from 'app/reservation/reservation.service';
import { IService } from 'app/service/service.schema';

@Injectable()
export class BusinessReservationService {
  constructor(@InjectModel('Reservation') private reservationModel: Model<Reservation>, private reservationService: ReservationService) { }

  async listServiceReservations(serviceId: ObjectID, page: number, projection = {}) {
    return performPaginatableQuery(this.reservationModel, { service: serviceId }, { _id: -1 }, page, projection);
  }

  async listAllReservations(userId: ObjectID, page: number, projection = {}) {
    return performPaginatableQuery(this.reservationModel, { owner: userId }, { _id: -1 }, page, projection);
  }

  async businessChangeReservationStatus(
    ownerId: ObjectID,
    oldStatus: ReservationStatus,
    { _id, ...payload }: Partial<IReservation>,
    projection = {}) {
    const reservation = await this.reservationModel.findById(_id, { status: true, service: true }).populate('service');
    if (!ownerId.equals((reservation.service as IService).owner as ObjectID)) {
      throw new ServiceNotOwnedException();
    }
    if (reservation.status !== oldStatus) {
      throw new InvalidReservationStatusTransitionException();
    }
    return await this.reservationService.updateReservation(_id, payload, projection);
  }
}
