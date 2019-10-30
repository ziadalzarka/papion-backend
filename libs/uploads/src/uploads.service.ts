import { FileUpload } from 'graphql-upload';
import { Injectable, Inject } from '@nestjs/common';
import { UploadsConfiguration } from './uploads.interface';
import { UPLOADS_CONFIGURATION } from './uploads.constants';
import { S3Service } from './s3/s3.service';

@Injectable()
export class UploadService {

  constructor(@Inject(UPLOADS_CONFIGURATION) private config: UploadsConfiguration, private s3Service: S3Service) { }

  async uploadFile(file: FileUpload): Promise<string> {
    return await this.s3Service.uploadFile(file);
  }

}
