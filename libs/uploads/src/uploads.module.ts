import { Module, DynamicModule } from '@nestjs/common';
import { S3Module } from './s3/s3.module';
import { UploadsConfiguration, UploadDriver } from './uploads.interface';
import { UPLOADS_CONFIGURATION } from './uploads.constants';
import { UploadService } from './uploads.service';

@Module({})
export class UploadsModule {
  static forRoot(config: UploadsConfiguration): DynamicModule {
    return {
      module: UploadsModule,
      imports: [
        ...config.driver === UploadDriver.S3 && [
          S3Module.forRoot(config.s3),
        ],
      ],
      providers: [
        { provide: UPLOADS_CONFIGURATION, useValue: config },
        UploadService,
      ],
      exports: [UploadService],
    };
  }
}
