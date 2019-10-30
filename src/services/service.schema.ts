import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { User } from '@gray/user-module';
import { ConfigUtils } from 'app/config/config.util';

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IService {
  @field({ ref: 'User' })
  user: User;
}

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class IVenueService {
  @field
  name: string;
}

export const ServiceSchema = buildSchema(IService);
export const VenueServiceSchema = buildSchema(IVenueService);

export type Service = IService & mongoose.Document;
export type VenueService = IVenueService & mongoose.Document;

export abstract class IQuery {

}
