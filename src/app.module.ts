import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // GraphQLModule.forRoot({
    //   autoSchemaFile: 'schema.gql',
    //   debug: false,
    //   playground: true,
    // }),
  ],
})
export class AppModule { }
