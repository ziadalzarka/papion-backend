import * as mongoose from 'mongoose';
import { MongooseDatabaseConfiguration } from './mongoose-database.interface';

export const generateDatabaseProviders = ({ host, database, port, username, password }: MongooseDatabaseConfiguration) => {
  return [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (): Promise<typeof mongoose> => {
        const databaseUrl = `mongodb://${username}:${password}@${host}:${port}/${database}`;
        return mongoose.connect(databaseUrl);
      },
    },
  ];
};
