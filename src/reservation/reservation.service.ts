import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessCalendarQueryInput } from 'app/business-cpanel/business-reservation/business-reservation.dto';
import { ServiceService } from 'app/service/service.service';
import { ObjectID } from 'bson';
import { Model } from 'mongoose';
import { InvalidReservationStatusTransitionException } from './exceptions/invalid-status-transition.exception';
import { ReservationDuplicatedException } from './exceptions/reservation-duplicated.exception';
import { ReservationNotOwnedException } from './exceptions/reservation-not-owned.exception';
import { ReservationStatus } from './reservation.dto';
import { IReservation, Reservation } from './reservation.schema';
import { Service } from 'app/service/service.schema';
import { ServiceNotOwnedException } from 'app/service/exceptions/service-not-owned.exception';
import { UserRequestsCannotBeDeletedException } from 'app/business-cpanel/business-reservation/exceptions/user-requests-cannot-be-deleted.exception';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel('Reservation') private reservationModel: Model<Reservation>,
    private serviceService: ServiceService,
    @Inject('PUB_SUB') private pubSub: PubSub) { }

  async createReservation(payload: Partial<IReservation>) {
    const doc = await new this.reservationModel(payload).save();
    await this.syncServiceReservedDays(doc.status, payload.service as ObjectID, payload.reservationDay);
    return doc;
  }

  async validateRequestNotDuplicated(payload: Partial<IReservation>) {
    const exists = await this.reservationModel.exists(payload);
    if (exists) {
      throw new ReservationDuplicatedException();
    }
  }

  async findOne(payload: Partial<IReservation>, projection = {}) {
    return await this.reservationModel.findOne(payload, projection);
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

  async syncServiceReservedDays(status: ReservationStatus, service: ObjectID, reservationDay: Date) {
    console.log({ status, service, reservationDay });
    switch (status) {
      // Already set as onGoing from Pending
      // case ReservationStatus.PendingConfirmation:
      // case ReservationStatus.Responded:
      // case ReservationStatus.PendingConfirmation:
      case ReservationStatus.Pending:
        return await this.serviceService.recordOnGoingRequest(service, 1);
      case ReservationStatus.BusinessRefused:
      case ReservationStatus.ClientRefused:
      case ReservationStatus.LeftUnconfirmed:
        return await this.serviceService.recordOnGoingRequest(service, -1);
      case ReservationStatus.Reserved:
        // moves it from onGonig to reservations stats
        return await this.serviceService.reserveDay(service as ObjectID, reservationDay);
      case ReservationStatus.Canceled:
        // decreases reservations stats
        return await this.serviceService.cancelDay(service as ObjectID, reservationDay);
    }
  }

  async updateReservation(id: ObjectID, payload: Partial<IReservation>, projection = {}) {
    if (payload.status && Object.keys(projection).length > 0) {
      projection = { ...projection, service: true, reservationDay: true };
    }
    const doc = await this.reservationModel.findOneAndUpdate({ _id: id }, payload, { select: projection, new: true });
    await this.syncServiceReservedDays(payload.status, doc.service as ObjectID, doc.reservationDay);
    return doc;
  }

  async _resolveReservation(id: ObjectID, projection = {}, population = '') {
    return await this.reservationModel.findById(id, projection).populate(population);
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

  async unmarkServiceCalendarDay(id: ObjectID, userId: ObjectID, population = {}) {
    const reservation = await this.reservationModel.findById(id).populate('service');
    if (!userId.equals((reservation.service as Service).owner as ObjectID)) {
      throw new ServiceNotOwnedException();
    } else if (reservation.client) {
      throw new UserRequestsCannotBeDeletedException();
    }
    await this.serviceService.cancelDay((reservation.service as Service)._id, reservation.reservationDay);
    return await this.reservationModel.findByIdAndDelete(id, { select: population });
  }

  async notifyBusinessReservationChange(reservation: IReservation) {
    this.pubSub.publish('reservationChanges', reservation);
  }
}
