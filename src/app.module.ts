import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { WeddingWebsiteModule } from './wedding-website/wedding-website.module';

@Module({
  imports: [
    DatabaseModule,
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
