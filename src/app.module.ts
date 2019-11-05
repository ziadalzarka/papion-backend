import { GraphqlEssentialsModule } from '@gray/graphql-essentials';
import { ConfigUtils } from 'app/config/config.util';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WeddingWebsiteModule } from './wedding-website/wedding-website.module';
import { UserModule } from 'app/user';
import { ServiceModule } from 'app/service/service.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import { TemplateModule } from './template/template.module';
import { PackageModule } from './package/package.module';
import { ReservationModule } from './reservation/reservation.module';
import { BusinessCpanelModule } from './business-cpanel/business-cpanel.module';
import * as mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

@Module({
  imports: [
    MongooseModule.forRoot(ConfigUtils.databaseUrl),
    GraphqlEssentialsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
      path: '/',
      installSubscriptionHandlers: true,
      // expose the schema and docs for the developers
      introspection: true,
      context: ({ req }) => ({ req }),
      uploads: {
        maxFileSize: ConfigUtils.files.maximumSize,
        maxFiles: 5,
      },
    }),
    UserModule,
    WeddingWebsiteModule,
    ServiceModule,
    SharedModule,
    TemplateModule,
    PackageModule,
    ReservationModule,
    BusinessCpanelModule,
  ],
})
export class AppModule { }
