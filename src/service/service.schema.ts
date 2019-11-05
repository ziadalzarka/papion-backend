import { ObjectID } from 'mongodb';
import { schema, field, buildSchema, unique, indexed } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { User } from 'app/user';
import { ConfigUtils } from 'app/config/config.util';
import { Address } from 'app/user/address.dto';
import { PersonCategory, PlaceCategory } from './category.dto';
import { BusinessCategory } from 'app/user/business-category.dto';
import { PackagePriority } from 'app/package/package.interface';

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IService {
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

ServiceSchema.index(ConfigUtils.database.discriminatorKey);
ServiceSchema.index({ 'address.city': 1 });
ServiceSchema.index({ 'address.country': 1 });

export type Service = IService & mongoose.Document;
export type PlaceService = IPlaceService & IService & mongoose.Document;
export type PersonService = IPersonService & IService & mongoose.Document;
