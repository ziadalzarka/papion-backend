import * as config from 'config';
import { DatabaseConfiguration } from './config.interface';

export class ConfigUtils {

  static get database(): DatabaseConfiguration {
    return config.get('database');
  }

  static get databaseUrl(): string {
    const { host, database, port, username, password } = this.database;
    return `mongodb://${host}:${port}/${database}?user=${username}&pass=${password}`;
  }
}
