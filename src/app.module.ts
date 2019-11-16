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
import { NotificationModule } from './notification/notification.module';
import { AuthGuard } from './user/auth.guard';
import { ReviewModule } from './review/review.module';
import * as mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('debug', true);

@Module({
  imports: [
    MongooseModule.forRoot(ConfigUtils.databaseUrl),
    GraphqlEssentialsModule,
    GraphQLModule.forRootAsync({
      imports: [UserModule],
      useFactory: (authGuard: AuthGuard) => ({
        autoSchemaFile: 'schema.gql',
        debug: false,
        playground: true,
        path: '/',
        installSubscriptionHandlers: true,
        // expose the schema and docs for the developers
        introspection: true,
        context: ({ req, connection }) => ({ req: req, ...connection && { query: connection.context }, meta: {} }),
        subscriptions: {
          onConnect: (connectionParams: any) => {
            const { token } = connectionParams;
            return { token };
          },
        },
        uploads: {
          maxFileSize: ConfigUtils.files.maximumSize,
          maxFiles: 100,
        },
      }),
    }),
    UserModule,
    WeddingWebsiteModule,
    ServiceModule,
    SharedModule,
    TemplateModule,
    PackageModule,
    ReservationModule,
    BusinessCpanelModule,
    NotificationModule,
    ReviewModule,
  ],
})
export class AppModule { }
