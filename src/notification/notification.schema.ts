import { User } from 'app/user';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, schema } from 'mongoose-schema-decorators';
import { NotificationType } from './notification-type.dto';

@schema({})
export class INotification {
  _id: ObjectID;
  @field
  notificationType: NotificationType;
  @field({ ref: 'User' })
  user: ObjectID | User;
  @field
  dataRef: ObjectID;
  @field({ default: () => new Date() })
  addedAt: Date;
}

export const NotificationSchema = buildSchema(INotification);

mongoose.model('Notification', NotificationSchema);

export type Notification = INotification & mongoose.Document;
