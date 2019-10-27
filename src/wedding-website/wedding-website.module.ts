import { Module } from '@nestjs/common';
import { WeddingWebsiteService } from './wedding-website.service';
import { WeddingWebsiteResolver } from './wedding-website.resolver';
import { MongooseDatabaseModule } from '@gray/mongoose-database';
import { weddingWebsiteProviders } from './wedding-website.provider';
import { UserModule } from '@gray/user-module';

@Module({
  imports: [MongooseDatabaseModule, UserModule],
  providers: [WeddingWebsiteService, WeddingWebsiteResolver, ...weddingWebsiteProviders],
  controllers: [],
})
export class WeddingWebsiteModule { }
