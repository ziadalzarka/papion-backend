import { ConfigUtils } from 'app/config/config.util';
import { User } from 'app/user';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { buildSchema, field, schema } from 'mongoose-schema-decorators';
import { NotificationType } from './notification.dto';

@schema({ discriminatorKey: ConfigUtils.database.discriminatorKey })
export class INotification {
  _id: ObjectID;
  @field
  notificationType: NotificationType;
  @field({ ref: 'User' })
  user: ObjectID | User;
}

export const NotificationSchema = buildSchema(INotification);

mongoose.model('Notification', NotificationSchema);

export type Notification = INotification & mongoose.Document;
