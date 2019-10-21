import * as config from 'config';
import { DatabaseConfiguration, ApplicationMetadata, TokenConfiguration } from './config.interface';

export class ConfigUtils {

  static get database(): DatabaseConfiguration {
    return config.get('database');
  }

  static get databaseUrl(): string {
    const { host, database, port, username, password } = this.database;
    return `mongodb://${username}:${password}@${host}:${port}/${database}`;
  }

  static get metadata(): ApplicationMetadata {
    return config.get('metadata');
  }

  static get token(): TokenConfiguration {
    return config.get('token');
  }
}
