import * as mongoose from 'mongoose';
import { ConfigUtils } from 'app/config/config.util';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose.connect(ConfigUtils.databaseUrl);
    },
  },
];
