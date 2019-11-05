import { ConfigUtils } from 'app/config/config.util';
import { PackagePriority } from 'app/package/package.interface';
import { User } from 'app/user';
import { Address } from 'app/user/address.dto';
import { BusinessCategory } from 'app/user/business-category.dto';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, indexed, schema } from 'mongoose-schema-decorators';
import { PersonCategory, PlaceCategory } from './category.dto';

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IService {
  _id: ObjectID;
  @indexed
  @field
  name: string;
  @indexed
  @field({ ref: 'User' })
  user: User | ObjectID;
  @indexed
  @field
  category: PlaceCategory | PersonCategory;
  @field
  businessCategory: BusinessCategory;
  @field
  address: Address;
  @field
  description: string;
  @field({ default: false })
  acceptsMultiple: boolean;
  @indexed
  @field
  startingPrice: number;
  @indexed
  @field({ default: PackagePriority.Free })
  packagePriority: PackagePriority;
  @indexed
  @field({ default: 0 })
  rating: number;
  @indexed
  @field({ default: false })
  published: boolean;
  @indexed
  @field({ default: () => new Date() })
  addedAt: Date;
}

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IPlaceService extends IService {
  @field
  coverImage: string;
  @field
  category: PlaceCategory;
}

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IPersonService extends IService {
  @field
  image: string;
  @field
  category: PersonCategory;
}

export const ServiceSchema = buildSchema(IService);
export const PlaceServiceSchema = buildSchema(IPlaceService);
export const PersonServiceSchema = buildSchema(IPersonService);

function ensureBusinessCategory(next) {
  if ((this as any)._fields && Object.keys((this as any)._fields).length > 0) {
    this.select({ businessCategory: true });
  }
  next();
}

// always include business category because it is needed for type resolving
ServiceSchema.pre('find', ensureBusinessCategory);
ServiceSchema.pre('findOne', ensureBusinessCategory);
ServiceSchema.pre('findOneAndUpdate', ensureBusinessCategory);

ServiceSchema.index(ConfigUtils.database.discriminatorKey);
ServiceSchema.index({ 'address.city': 1 });
ServiceSchema.index({ 'address.country': 1 });

export type Service = IService & mongoose.Document;
export type PlaceService = IPlaceService & IService & mongoose.Document;
export type PersonService = IPersonService & IService & mongoose.Document;
