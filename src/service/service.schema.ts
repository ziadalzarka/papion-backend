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
  @field
  name: string;
  @indexed
  @field({ ref: 'User' })
  user: User | ObjectID;
  @field
  category: PlaceCategory | PersonCategory;
  @field
  businessCategory: BusinessCategory;
  @field
  address: Address;
  @field
  description: string;
  @field
  startingPrice: number;
  @field({ default: PackagePriority.Free })
  packagePriority: PackagePriority;
  @field({ default: 0 })
  rating: number;
  @field({ default: false })
  published: boolean;
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

export type Service = IService & mongoose.Document;
export type PlaceService = IPlaceService & IService & mongoose.Document;
export type PersonService = IPersonService & IService & mongoose.Document;

export abstract class IQuery {

}
