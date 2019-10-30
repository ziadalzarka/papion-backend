import { GraphqlEssentialsModule } from '@gray/graphql-essentials';
import { ConfigUtils } from 'app/config/config.util';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WeddingWebsiteModule } from './wedding-website/wedding-website.module';
import { UserModule } from '@gray/user-module';
import { ServicesModule } from './services/services.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import * as mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

@Module({
  imports: [
    MongooseModule.forRoot(ConfigUtils.databaseUrl),
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
    ServicesModule,
    SharedModule,
  ],
})
export class AppModule { }
