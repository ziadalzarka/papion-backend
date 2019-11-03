import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlaceService, PersonService, Service, IPersonService, IPlaceService } from 'app/service/service.schema';
import { ObjectID } from 'mongodb';
import { PlaceServiceEntity, PersonServiceEntity } from './service.dto';
import { BusinessCategory } from 'app/user/business-category.dto';
import { SearchPayloadInput } from './search.dto';
import { ServiceSearchOrderBy } from './service-search-order-by.dto';
import { SortKey } from './sort-key.dto';

@Injectable()
export class ServiceService {

  constructor(
    @InjectModel('PlaceService') private placeServiceModel: Model<PlaceService>,
    @InjectModel('PersonService') private personServiceModel: Model<PersonService>,
    @InjectModel('Service') private serviceModel: Model<Service>,
  ) { }

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

  private generateSortPayload(orderBy: ServiceSearchOrderBy, sortKey: SortKey) {
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

  async searchServices(payload: SearchPayloadInput) {
    const cursor = this.serviceModel.find({
      ...payload.query && { name: new RegExp(`/^${payload.query}/`) },
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
    })
      .sort(this.generateSortPayload(payload.orderBy, payload.sortKey));
    return await cursor.exec();
  }

}
