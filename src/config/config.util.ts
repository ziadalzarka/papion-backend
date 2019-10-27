import * as config from 'config';
import { DatabaseConfiguration, ApplicationMetadata, TokenConfiguration, ReverseProxyConfiguration } from './config.interface';

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

  static get reverseProxy(): ReverseProxyConfiguration {
    return config.get('reverseProxy');
  }
}
