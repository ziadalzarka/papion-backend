import { ResultsPage } from '@gray/graphql-essentials/page.dto';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPersonService, IPlaceService, PersonService, PlaceService, Service } from 'app/service/service.schema';
import { BusinessCategory } from 'app/user/business-category.dto';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { SearchPayloadInput } from './search.dto';
import { ServiceSearchOrderBy } from './service-search-order-by.dto';
import { PersonServiceEntity, PlaceServiceEntity } from './service.dto';
import { SortKey } from './sort-key.dto';
import { ServiceNotAvailableException } from './exceptions/service-not-available.exception';

@Injectable()
export class ServiceService {

  constructor(
    @InjectModel('PlaceService') private placeServiceModel: Model<PlaceService>,
    @InjectModel('PersonService') private personServiceModel: Model<PersonService>,
    @InjectModel('Service') private serviceModel: Model<Service>,
  ) { }

  async validateServicePublished(id: ObjectID) {
    const doc = await this.serviceModel.findById(id, { published: 1 });
    if (!doc || !doc.published) {
      throw new ServiceNotAvailableException();
    }
  }

  async _resolveService(id: ObjectID) {
    return await this.serviceModel.findById(id);
  }

  async updatePersonService(userId: ObjectID, payload: Partial<IPersonService>) {
    const doc = await this.personServiceModel.findOneAndUpdate({ user: userId }, payload, { new: true, upsert: true, setDefaultsOnInsert: true });
    return new PersonServiceEntity(doc);
  }

  async getPersonService(userId: ObjectID) {
    const doc = await this.personServiceModel.findOne({ user: userId });
    return new PersonServiceEntity(doc);
  }

  async listPlaceServices(userId: ObjectID) {
    const docs = await this.placeServiceModel.find({ user: userId });
    return docs.map(doc => new PlaceServiceEntity(doc));
  }

  async createPlaceService(payload: Partial<IPlaceService>) {
    const doc = await new this.placeServiceModel({ ...payload, businessCategory: BusinessCategory.Place }).save();
    return new PlaceServiceEntity(doc);
  }

  async updatePlaceService(_id: ObjectID, payload: Partial<IPlaceService>) {
    const doc = await this.placeServiceModel.findByIdAndUpdate(_id, payload, { new: true });
    return new PlaceServiceEntity(doc);
  }

  async _resolvePlaceService(_id: ObjectID) {
    const doc = await this.placeServiceModel.findById(_id);
    return new PlaceServiceEntity(doc);
  }

  private generateSearhQuery(payload: SearchPayloadInput) {
    return {
      ...payload.query && { name: new RegExp(`^${payload.query}`) },
      ...payload.category && { category: payload.category },
      ...payload.packagePriority && { packagePriority: payload.packagePriority },
      ...payload.country && { 'address.country': payload.country },
      ...payload.city && { 'address.city': payload.city },
      ...payload.priceRange && {
        $and: [
          { startingPrice: { $gte: payload.priceRange.startPrice } },
          { startingPrice: { $lte: payload.priceRange.endPrice } },
        ],
      },
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
      default:
        return {};
    }
  }

  async searchServices(payload: SearchPayloadInput): Promise<ResultsPage> {
    const query = this.generateSearhQuery(payload);
    const sort = this.generateSortPayload(payload.orderBy, payload.sortKey);
    return await performPaginatableQuery(this.serviceModel, query, sort, payload.page);
  }

}
