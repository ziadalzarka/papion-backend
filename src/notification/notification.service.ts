import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notification, INotification } from './notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ObjectID } from 'mongodb';

@Injectable()
export class NotificationService {

  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    @InjectModel('Notification') private notificationModel: Model<Notification>) {
  }

  async createNotification(payload: Partial<INotification>) {
    const doc = await new this.notificationModel(payload).save();
    this.pubSub.publish('notificationReceived', doc.toJSON());
  }

  async listNotifications(user: ObjectID, page: number = 1, projection = {}) {
    return await performPaginatableQuery(this.notificationModel, { user }, { _id: -1 }, page, projection);
  }

  async markAsSeen(last: ObjectID) {
    await this.notificationModel.updateMany({ _id: { $lte: last } }, { seen: true });
  }

}
