import { WeddingWebsiteSchema } from './wedding-website.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { WeddingWebsiteService } from './wedding-website.service';
import { WeddingWebsiteResolver } from './wedding-website.resolver';
import { UserModule } from '@gray/user-module';
import { UploadsModule, UploadDriver } from '@gray/uploads';
import { ConfigUtils } from 'app/config/config.util';
import { SharedModule } from 'app/shared/shared.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'WeddingWebsite', schema: WeddingWebsiteSchema }]),
    SharedModule,
  ],
  providers: [WeddingWebsiteService, WeddingWebsiteResolver],
  controllers: [],
})
export class WeddingWebsiteModule { }
