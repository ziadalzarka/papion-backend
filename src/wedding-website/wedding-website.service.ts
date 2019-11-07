import { ObjectID } from 'mongodb';
import { WeddingWebsiteExistsException } from './exceptions/wedding-website-exists.exception';
import { WeddingWebsite } from './wedding-website.schema';
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

  findBySubdomain(subdomain: string, projection = {}) {
    return this.weddingWebsiteModel.findOne({ subdomain }, projection);
  }

  async validateReservation(reservationId: ObjectID, userId: ObjectID) {
    const reservation = await this.reservationService._resolveReservation(reservationId, { client: true, service: true });
    if (reservation.status !== ReservationStatus.Reserved) {
      throw new ReservationNotConfirmedException();
    }
    if (!userId.equals(reservation.client as ObjectID)) {
      throw new ReservationNotOwnedException();
    }
    return reservation.service;
  }

  async validateWeddingWebsiteQuotaAvailable(userId: ObjectID) {
    const exists = await this.weddingWebsiteModel.exists({ user: userId });
    if (exists) {
      throw new WeddingWebsiteQuotaCompleteException();
    }
  }

}
