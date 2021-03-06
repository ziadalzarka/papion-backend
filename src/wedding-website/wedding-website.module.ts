import { WeddingWebsiteSchema } from './wedding-website.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { WeddingWebsiteService } from './wedding-website.service';
import { WeddingWebsiteResolver } from './wedding-website.resolver';
import { UserModule } from 'app/user';
import { SharedModule } from 'app/shared/shared.module';
import { TemplateModule } from 'app/template/template.module';
import { ServiceModule } from 'app/service/service.module';
import { ReservationModule } from 'app/reservation/reservation.module';
import { NotificationModule } from 'app/notification/notification.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'WeddingWebsite', schema: WeddingWebsiteSchema }]),
    SharedModule,
    TemplateModule,
    ServiceModule,
    ReservationModule,
    NotificationModule,
  ],
  providers: [WeddingWebsiteService, WeddingWebsiteResolver],
  exports: [WeddingWebsiteService],
})
export class WeddingWebsiteModule { }
