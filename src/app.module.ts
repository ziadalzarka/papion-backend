import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { WeddingWebsiteModule } from './wedding-website/wedding-website.module';
import { MongooseDatabaseModule } from '@gray/mongoose-database';

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
