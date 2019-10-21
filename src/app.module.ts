import { ConfigUtils } from 'app/config/config.util';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WeddingWebsiteModule } from './wedding-website/wedding-website.module';
import { MongooseDatabaseModule } from '@gray/mongoose-database';
import { UserModule } from '@gray/user-module';

@Module({
  imports: [
    MongooseDatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    WeddingWebsiteModule,
  ],
})
export class AppModule { }
