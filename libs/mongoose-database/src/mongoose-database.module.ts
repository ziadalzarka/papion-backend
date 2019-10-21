import { Module, DynamicModule } from '@nestjs/common';
import { generateDatabaseProviders } from './mongoose-database.providers';
import * as mongoose from 'mongoose';
import { MongooseDatabaseConfiguration } from './mongoose-database.interface';
import { ConfigUtils } from 'app/config/config.util';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const config = ConfigUtils.database;
const providers = generateDatabaseProviders(config);

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class MongooseDatabaseModule { }
