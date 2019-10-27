import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { User } from '@gray/user-module';

@schema({ discriminatorKey: '__typename' })
export class IService {
  @field({ ref: 'User' })
  user: User;
}

@schema({ discriminatorKey: '__typename' })
export class IVenueService {

}

export const ServiceSchema = buildSchema(IService);

export type Service = IService & mongoose.Document;

export abstract class IQuery {

}
