import { S3Configuration } from './s3/s3.interface';

export enum UploadDriver {
  Local = 'local',
  S3 = 's3',
}

export interface UploadsConfiguration {
  driver: UploadDriver;
  s3?: S3Configuration;
}
