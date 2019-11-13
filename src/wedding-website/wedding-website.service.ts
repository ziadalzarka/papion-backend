import { ObjectID } from 'mongodb';
import { WeddingWebsiteExistsException } from './exceptions/wedding-website-exists.exception';
import { WeddingWebsite, IWeddingWebsite } from './wedding-website.schema';
import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import { ConfigUtils } from 'app/config/config.util';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReservationService } from 'app/reservation/reservation.service';
import { ReservationStatus } from 'app/reservation/reservation.dto';
import { ReservationNotConfirmedException } from './exceptions/reservation-not-confirmed.exception';
import { ReservationNotOwnedException } from 'app/reservation/exceptions/reservation-not-owned.exception';
import { WeddingWebsiteQuotaCompleteException } from './exceptions/wedding-website-quota-complete.exception';
import { PlaceService } from 'app/service/service.schema';
import { WeddingWebsitesDisabledException } from './exceptions/wedding-websites-disabled.exception';
import { WeddingWebsiteNotOwnedException } from './exceptions/wedding-website-not-owned.exception';
import { WeddingWebsiteDoesNotExistException } from './exceptions/wedding-website-does-not-exist.exception';

@Injectable()
export class WeddingWebsiteService {

  private _host = 'https://proxy.papion.love';

  constructor(
    @InjectModel('WeddingWebsite') private weddingWebsiteModel: Model<WeddingWebsite>,
    private reservationService: ReservationService) {
    this.init();
  }

  init() {
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${ConfigUtils.reverseProxy.secret}`;
      return config;
    });
  }

  async validateWeddingWebsiteAvailable(subdomain: string) {
    const exists = await this.weddingWebsiteModel.exists({ subdomain });
    if (exists) {
      throw new WeddingWebsiteExistsException();
    }
  }

  async validateWeddingWebsiteOwned(id: ObjectID, userId: ObjectID) {
    const doc = await this._resolveWeddingWebsite(id);
    if (!doc) {
      throw new WeddingWebsiteDoesNotExistException();
    }
    if (!userId.equals(doc.user as ObjectID)) {
      throw new WeddingWebsiteNotOwnedException();
    }
    return doc;
  }

  registerWeddingWebsite(subdomain: string) {
    return axios.post(`${this._host}/entries`, {
      hostname: `${subdomain}.papion.love`,
      group: 'Papion Wedding Websites',
      destination: 'pww:3200',
      sslEnabled: true,
    }).catch((err) => {
      if (err.response.status !== 422) {
        throw err;
      }
    });
  }

  async createWeddingWebsite(payload: Partial<WeddingWebsite>) {
    return await new this.weddingWebsiteModel(payload).save();
  }

  async findOne(query: Partial<IWeddingWebsite>, projection = {}) {
    return await this.weddingWebsiteModel.findOne(query, projection);
  }

  async validateReservation(reservationId: ObjectID, userId: ObjectID) {
    const reservation = await this.reservationService._resolveReservation(reservationId, {
      client: true,
      service: true,
      status: true,
    }, 'service');
    if (reservation.status !== ReservationStatus.Reserved) {
      throw new ReservationNotConfirmedException();
    }
    if (!userId.equals(reservation.client as ObjectID)) {
      throw new ReservationNotOwnedException();
    }
    if (!(reservation.service as PlaceService).weddingWebsitesEnabled) {
      throw new WeddingWebsitesDisabledException();
    }
    return (reservation.service as PlaceService)._id;
  }

  async validateWeddingWebsiteQuotaAvailable(userId: ObjectID) {
    const exists = await this.weddingWebsiteModel.exists({ user: userId });
    if (exists) {
      throw new WeddingWebsiteQuotaCompleteException();
    }
  }

  async _resolveWeddingWebsite(id: ObjectID, projection = {}) {
    return await this.weddingWebsiteModel.findById(id, projection);
  }

  async deleteWeddingWebsite(id: ObjectID) {
    return await this.weddingWebsiteModel.findByIdAndDelete(id);
  }

  async updateWeddingWebsite(id: ObjectID, payload: Partial<IWeddingWebsite>, projection = {}) {
    return await this.weddingWebsiteModel.findByIdAndUpdate(id, payload, { new: true, select: projection });
  }

}
