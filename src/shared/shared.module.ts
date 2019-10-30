import { Module } from '@nestjs/common';
import { UploadsModule, UploadDriver } from '@gray/uploads';
import { ConfigUtils } from 'app/config/config.util';

@Module({
  imports: [
    UploadsModule.forRoot({
      driver: UploadDriver.S3,
      s3: ConfigUtils.s3,
    }),
  ],
  exports: [
    UploadsModule,
  ],
})
export class SharedModule { }
