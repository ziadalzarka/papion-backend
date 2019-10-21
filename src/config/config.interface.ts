export interface ApplicationMetadata {
  domain?: string;
  cookieMaxAge?: number;
}

export interface DatabaseConfiguration {
  host?: string;
  database?: string;
  port?: number;
  username?: string;
  password?: string;
}

export interface TokenConfiguration {
  auth?: string;
}

export interface ConfigurationSchema {
  $schema?: string;
  metadata?: ApplicationMetadata;
  database?: DatabaseConfiguration;
  token?: TokenConfiguration;
}
