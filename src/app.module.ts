import { ConfigUtils } from 'app/config/config.util';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WeddingWebsiteModule } from './wedding-website/wedding-website.module';
import { MongooseDatabaseModule } from '@gray/mongoose-database';
import { UserModule } from '@gray/user-module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    MongooseDatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
      path: '/',
      // expose the schema and docs for the developers
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    WeddingWebsiteModule,
    ServicesModule,
  ],
})
export class AppModule { }
