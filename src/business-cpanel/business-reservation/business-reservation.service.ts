import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InvalidReservationStatusTransitionException } from 'app/reservation/exceptions/invalid-status-transition.exception';
import { ReservationStatus } from 'app/reservation/reservation.dto';
import { IReservation, Reservation } from 'app/reservation/reservation.schema';
import { ReservationService } from 'app/reservation/reservation.service';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { IService, Service } from 'app/service/service.schema';
import { groundDate } from 'app/shared/date.util';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { ServiceMarkCalendarInput } from './business-reservation.dto';

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

  async serviceMarkCalendar(service: Service, payload: ServiceMarkCalendarInput, info: GraphQLResolveInfo) {
    payload.reservationDay = groundDate(payload.reservationDay);
    // validate reservation belongs to service
    const reservation = await this.reservationService.findOne({ _id: payload.id });
    if (reservation && !reservation.service.equals(service._id)) {
      throw new ServiceNotOwnedException();
    }
    // extract data
    const data = {
      service: service._id,
      status: payload.status,
      reservationDay: payload.reservationDay,
      notes: payload.notes,
    };
    if (reservation) {
      // update existing reservation
      return await this.reservationService.updateReservation(payload.id, data, graphqlMongodbProjection(info));
    } else {
      // validate reservation is not a duplicate
      if (!service.acceptsMultiple) {
        await this.reservationService.validateRequestNotDuplicated({
          reservationDay: payload.reservationDay,
          service: service._id,
          status: ReservationStatus.Reserved,
        });
      }
      // create a new reservation
      return await this.reservationService.createReservation(data);
    }
  }
}
