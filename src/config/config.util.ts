import * as config from 'config';
import { ApplicationMetadata, TokenConfiguration, ReverseProxyConfiguration, DatabaseConfiguration, FileConfiguration } from './config.interface';
import { S3Configuration } from '@gray/uploads/s3/s3.interface';
import { EmailConfiguration } from '@gray/email/email.interface';

export class ConfigUtils {

  static get database(): DatabaseConfiguration {
    return config.get('database');
  }

  static get databaseUrl(): string {
    const { username, password, host, port, database } = this.database;
    return `mongodb://${username}:${password}@${host}:${port}/${database}`;
  }

  static get metadata(): ApplicationMetadata {
    return config.get('metadata');
  }

  static get token(): TokenConfiguration {
    return config.get('token');
  }

  static get files(): FileConfiguration {
    return config.get('files');
  }

  static get reverseProxy(): ReverseProxyConfiguration {
    return config.get('reverseProxy');
  }

  static get s3(): S3Configuration {
    return config.get('s3');
  }

  static get email(): EmailConfiguration {
    return config.get('email');
  }
}
