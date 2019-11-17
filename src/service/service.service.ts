import { ResultsPage } from '@gray/graphql-essentials/page.dto';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPersonService, IPlaceService, PersonService, PlaceService, Service, IService } from 'app/service/service.schema';
import { BusinessCategory } from 'app/user/business-category.dto';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { SearchPayloadInput } from './search.dto';
import { ServiceSearchOrderBy } from './service-search-order-by.dto';
import { PersonServiceEntity, PlaceServiceEntity } from './service.dto';
import { SortKey } from './sort-key.dto';
import { ServiceNotAvailableException } from './exceptions/service-not-available.exception';
import { ServiceNotFoundException } from './exceptions/service-not-found.exception';
import { ServiceNotOwnedException } from './exceptions/service-not-owned.exception';
import { groundDate } from 'app/shared/date.util';
import * as moment from 'moment';

@Injectable()
export class ServiceService {

  constructor(
    @InjectModel('PlaceService') private placeServiceModel: Model<PlaceService>,
    @InjectModel('PersonService') private personServiceModel: Model<PersonService>,
    @InjectModel('Service') private serviceModel: Model<Service>,
  ) { }

  async validateServicePublished(id: ObjectID, projection = {}) {
    const doc = await this.serviceModel.findById(id, { ...projection, published: true, acceptsMultiple: true });
    if (!doc || !doc.published) {
      throw new ServiceNotAvailableException();
    }
    return doc;
  }

  async _resolveService(id: ObjectID, projection = {}) {
    return await this.serviceModel.findById(id, projection);
  }

  async _resolvePersonService(userId: ObjectID) {
    return await this.personServiceModel.findOne({ owner: userId });
  }

  async validateServiceOwned(serviceId: ObjectID, userId: ObjectID) {
    const service = await this.serviceModel.findById(serviceId);
    if (!userId.equals(service.owner as any)) {
      throw new ServiceNotOwnedException();
    }
    return service;
  }

  async updatePersonService(userId: ObjectID, payload: Partial<IPersonService> | any, projection = {}) {
    const doc = await this.personServiceModel.findOneAndUpdate({ owner: userId }, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      select: projection,
    });
    return new PersonServiceEntity(doc);
  }

  async getPersonService(userId: ObjectID, projection = {}) {
    const doc = await this.personServiceModel.findOne({ owner: userId }, projection);
    return new PersonServiceEntity(doc);
  }

  async listPlaceServices(userId: ObjectID, projection = {}) {
    const docs = await this.placeServiceModel.find({ owner: userId }, projection);
    return docs.map(doc => new PlaceServiceEntity(doc));
  }

  async createPlaceService(payload: Partial<IPlaceService>) {
    const doc = await new this.placeServiceModel({ ...payload, businessCategory: BusinessCategory.Place }).save();
    return new PlaceServiceEntity(doc);
  }

  async updatePlaceService(_id: ObjectID, payload: Partial<IPlaceService> | any, projection = {}) {
    const doc = await this.placeServiceModel.findByIdAndUpdate(_id, payload, { new: true, select: projection });
    return new PlaceServiceEntity(doc);
  }

  async _resolvePlaceService(_id: ObjectID, projection = {}) {
    const doc = await this.placeServiceModel.findById(_id, projection);
    if (!doc) {
      throw new ServiceNotFoundException();
    }
    return new PlaceServiceEntity(doc);
  }

  private daysRange(fromDate: Date, toDate: Date) {
    const start = groundDate(fromDate);
    const end = groundDate(toDate);
    const daysCount = moment(end).diff(start, 'day');
    const days = [];
    for (let i = 0; i <= daysCount; i++) {
      days.push(moment(start).add(i, 'days').toDate());
    }
    return days;
  }

  private generateTimeRangeFilter(fromDate: Date, toDate: Date) {
    const $or = this.daysRange(fromDate, toDate).map(date => ({ reservedDays: { $ne: new Date(date) } }));
    return { $or };
  }

  private generateSearchQuery(payload: SearchPayloadInput) {
    return {
      ...payload.query && { name: new RegExp(`^${payload.query}`) },
      ...payload.country && { 'address.country': payload.country },
      ...payload.city && { 'address.city': payload.city },
      ...payload.category && { category: payload.category },
      ...payload.packagePriority && { packagePriority: payload.packagePriority },
      ...payload.minCapacity && { capacity: { $gte: payload.minCapacity } },
      ...payload.priceRange && {
        $and: [
          { startingPrice: { $gte: payload.priceRange.startPrice } },
          { startingPrice: { $lte: payload.priceRange.endPrice } },
        ],
      },
      ...payload.timeRange && this.generateTimeRangeFilter(payload.timeRange.startDate, payload.timeRange.endDate),
    };
  }

  private generateSortPayload(orderBy: ServiceSearchOrderBy, sortKey: SortKey = SortKey.Descending) {
    switch (orderBy) {
      case ServiceSearchOrderBy.Price:
        return { startingPrice: sortKey };
      case ServiceSearchOrderBy.Rating:
        return { rating: sortKey };
      case ServiceSearchOrderBy.AddedAt:
        return { addedAt: sortKey };
      case ServiceSearchOrderBy.Popularity:
        return { popularity: sortKey };
      case ServiceSearchOrderBy.Time:
        return { reservedDays: sortKey };
      default:
        return {};
    }
  }

  async searchServices(payload: SearchPayloadInput, projection = {}): Promise<ResultsPage> {
    const query = this.generateSearchQuery(payload);
    const sort = this.generateSortPayload(payload.orderBy, payload.sortKey);
    const result = await performPaginatableQuery(this.serviceModel, query, sort, payload.page, projection);
    const ids = result.edges.map(edge => edge._id);
    await this.recordSearchHits(ids);
    return result;
  }

  async reserveDay(id: ObjectID, day: Date) {
    await this.serviceModel.findByIdAndUpdate(id, {
      $addToSet: {
        reservedDays: groundDate(day),
      }, $inc: {
        'statistics.onGoingRequests': -1,
        'statistics.reservations': 1,
      },
    });
  }

  async cancelDay(id: ObjectID, day: Date) {
    await this.serviceModel.findByIdAndUpdate(id, { $pull: { reservedDays: groundDate(day) }, $inc: { 'statistics.reservations': -1 } });
  }

  async find(query, projection = {}) {
    return await this.serviceModel.find(query, projection);
  }

  async count(query) {
    return await this.serviceModel.countDocuments(query);
  }

  async updateService(_id: ObjectID, payload: Partial<Service>) {
    return await this.serviceModel.findByIdAndUpdate(_id, payload, { new: true });
  }

  private async recordStat(ids: ObjectID[], key: string, count = 1) {
    await this.serviceModel.updateMany({ _id: { $in: ids } }, { $inc: { [`statistics.${key}`]: count } });
  }

  async recordPageHit(_id: ObjectID, count = 1) {
    await this.recordStat([_id], 'pageHits', count);
  }

  async recordSearchHits(ids: ObjectID[], count = 1) {
    await this.recordStat(ids, 'searchHits', count);
  }

  async recordOnGoingRequest(_id: ObjectID, count = 1) {
    await this.recordStat([_id], 'onGoingRequests', count);
  }

  async recordReservation(_id: ObjectID, count = 1) {
    await this.recordStat([_id], 'reservations', count);
  }

}
