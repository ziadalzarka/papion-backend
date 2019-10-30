import { WeddingWebsiteSchema } from './wedding-website.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { WeddingWebsiteService } from './wedding-website.service';
import { WeddingWebsiteResolver } from './wedding-website.resolver';
import { UserModule } from '@gray/user-module';
import { UploadsModule, UploadDriver } from '@gray/uploads';
import { ConfigUtils } from 'app/config/config.util';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'WeddingWebsite', schema: WeddingWebsiteSchema }]),
    UploadsModule.forRoot({
      driver: UploadDriver.S3,
      s3: ConfigUtils.s3,
    }),
  ],
  providers: [WeddingWebsiteService, WeddingWebsiteResolver],
  controllers: [],
})
export class WeddingWebsiteModule { }
