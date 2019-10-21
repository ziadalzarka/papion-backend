import { Module } from '@nestjs/common';
import { databaseProviders } from './mongoose-database.providers';
import * as mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class MongooseDatabaseModule { }
