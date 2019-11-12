import { Module, forwardRef } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notification.schema';
import { PubSub } from 'graphql-subscriptions';
import { WeddingWebsiteModule } from 'app/wedding-website/wedding-website.module';
import { ReservationModule } from 'app/reservation/reservation.module';
import { UserModule } from 'app/user';

@Module({
  imports: [
    forwardRef(() => WeddingWebsiteModule),
    ReservationModule,
    UserModule,
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
  ],
  providers: [NotificationResolver, NotificationService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  exports: [NotificationService],
})
export class NotificationModule { }
