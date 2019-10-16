export interface DatabaseConfiguration {
  host?: string;
  database?: string;
  port?: number;
  username?: string;
  password?: string;
}

export interface ConfigurationSchema {
  $schema?: string;
  database?: DatabaseConfiguration;
}
