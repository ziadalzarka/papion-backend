import { ConfigUtils } from 'app/config/config.util';
import { PackagePriority } from 'app/package/package.interface';
import { User } from 'app/user';
import { Address } from 'app/user/address.dto';
import { BusinessCategory } from 'app/user/business-category.dto';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, indexed, schema } from 'mongoose-schema-decorators';
import { PersonCategory, PlaceCategory } from './category.dto';
import { ensureProjection } from 'app/shared/mongoose.util';
import { ServiceStatistics } from 'app/service/service-statistics.dto';

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IService {
  _id: ObjectID;
  @indexed
  @field
  name: string;
  @indexed
  @field({ ref: 'User' })
  owner: User | ObjectID;
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
  @field({ default: [] })
  gallery: string[];
  @indexed
  @field({ default: [] })
  reservedDays: Date[];
  @field
  popularity: number;
  @field({
    default: {
      searchHits: 0,
      pageHits: 0,
      onGoingRequests: 0,
      reservations: 0,
    },
  })
  statistics: ServiceStatistics;
}

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IPlaceService extends IService {
  @field
  coverImage: string;
  @field
  category: PlaceCategory;
  @indexed
  @field
  capacity: number;
  @field({ default: true })
  weddingWebsitesEnabled: boolean;
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

// always include business category because it is needed for type resolving
ensureProjection(ServiceSchema, { businessCategory: true });

ServiceSchema.index(ConfigUtils.database.discriminatorKey);
ServiceSchema.index({ 'address.city': 1 });
ServiceSchema.index({ 'address.country': 1 });

export type Service = IService & mongoose.Document;
export type PlaceService = IPlaceService & IService & mongoose.Document;
export type PersonService = IPersonService & IService & mongoose.Document;
