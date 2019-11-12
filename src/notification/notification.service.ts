import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Notification, INotification } from './notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';

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

}
