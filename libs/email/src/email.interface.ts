export interface EmailConfiguration {
  daemonName?: string;
  senderEmail?: string;
  host?: string;
  username?: string;
  password?: string;
  templatesDirectory?: string;
  context?: any;
}
