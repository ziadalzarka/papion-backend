import { WeddingWebsiteSchema } from './wedding-website.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { WeddingWebsiteService } from './wedding-website.service';
import { WeddingWebsiteResolver } from './wedding-website.resolver';
import { UserModule } from 'app/user';
import { SharedModule } from 'app/shared/shared.module';
import { TemplateModule } from 'app/template/template.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'WeddingWebsite', schema: WeddingWebsiteSchema }]),
    SharedModule,
    TemplateModule,
  ],
  providers: [WeddingWebsiteService, WeddingWebsiteResolver],
  controllers: [],
})
export class WeddingWebsiteModule { }
