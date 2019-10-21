import * as mongoose from 'mongoose';
import { ConfigUtils } from 'app/config/config.util';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      const { host, database, port, username, password } = ConfigUtils.database;
      const databaseUrl = `mongodb://${username}:${password}@${host}:${port}/${database}`;
      return mongoose.connect(databaseUrl);
    },
  },
];
