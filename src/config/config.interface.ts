import { S3Configuration } from '@gray/uploads/s3/s3.interface';
import { EmailConfiguration } from '@gray/email/email.interface';

export interface ApplicationMetadata {
  domain?: string;
  port?: number;
  cookieMaxAge?: number;
  pageSize?: number;
  production?: boolean;
  resetCodeExpiresAfter?: number;
}

export interface DatabaseConfiguration {
  host?: string;
  database?: string;
  port?: number;
  username?: string;
  password?: string;
  discriminatorKey?: string;
}

export interface FileConfiguration {
  maximumSize?: number;
}

export interface TokenConfiguration {
  auth?: string;
}

export interface ReverseProxyConfiguration {
  secret?: string;
}

export interface ConfigurationSchema {
  $schema?: string;
  metadata?: ApplicationMetadata;
  database?: DatabaseConfiguration;
  token?: TokenConfiguration;
  reverseProxy?: ReverseProxyConfiguration;
  files?: FileConfiguration;
  s3?: S3Configuration;
  email?: EmailConfiguration;
}
