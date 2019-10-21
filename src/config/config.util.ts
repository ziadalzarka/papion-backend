import * as config from 'config';
import { DatabaseConfiguration, ApplicationMetadata, TokenConfiguration } from './config.interface';

export class ConfigUtils {

  static get database(): DatabaseConfiguration {
    return config.get('database');
  }

  static get metadata(): ApplicationMetadata {
    return config.get('metadata');
  }

  static get token(): TokenConfiguration {
    return config.get('token');
  }
}
