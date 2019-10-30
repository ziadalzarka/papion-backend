import { FileUpload } from 'graphql-upload';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { S3_CONFIGURATION } from './s3.constants';
import { S3Configuration } from './s3.interface';
import * as S3 from 'aws-sdk/clients/s3';
import { ReadStream, createWriteStream } from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

@Injectable()
export class S3Service {

  private _client: S3;

  constructor(@Inject(S3_CONFIGURATION) private config: S3Configuration) {
    if (config) {
      this.init();
    }
  }

  private init() {
    const { accessKeyId, secretAccessKey, endpoint } = this.config;
    this._client = new S3({ accessKeyId, secretAccessKey, endpoint });
  }

  async uploadFile(file: FileUpload): Promise<string> {
    if (!this.config) {
      Logger.error('Configure S3 first before using it!');
    }
    const filename = this.generateFilename(file);
    const stream = file.createReadStream();
    await this.putFile(filename, stream);
    return this.generateDownloadURL(filename);
  }

  private async putFile(filename: string, readStream: ReadStream) {
    return await this._client.upload({
      Bucket: this.config.bucket,
      Body: readStream,
      Key: `${this.config.path}/${filename}`,
      ACL: 'public-read',
    }).promise();
  }

  private generateFilename(file: FileUpload) {
    const parsedPath = path.parse(file.filename);
    const extension = mime.extension(file.mimetype);
    return `${parsedPath.name}.${extension}`;
  }

  private generateDownloadURL(filename: string) {
    return `${this.config.endpoint}/${this.config.bucket}/${this.config.path}/${filename}`;
  }

}
