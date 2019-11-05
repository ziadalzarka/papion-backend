import { ObjectID } from 'mongodb';
import { WeddingWebsiteExistsException } from './exceptions/wedding-website-exists.exception';
import { WeddingWebsite } from './wedding-website.schema';
import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import { ConfigUtils } from 'app/config/config.util';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WeddingWebsiteService {

  private _host = 'https://proxy.papion.love';

  constructor(@InjectModel('WeddingWebsite') private weddingWebsiteModel: Model<WeddingWebsite>) {
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

}
