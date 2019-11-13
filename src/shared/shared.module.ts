import { Module } from '@nestjs/common';
import { UploadsModule, UploadDriver } from '@gray/uploads';
import { ConfigUtils } from 'app/config/config.util';
import { EmailModule } from '@gray/email';

@Module({
  imports: [
    UploadsModule.forRoot({
      driver: UploadDriver.S3,
      s3: ConfigUtils.s3,
    }),
    EmailModule.forRoot(ConfigUtils.email),
  ],
  exports: [
    UploadsModule,
    EmailModule,
  ],
})
export class SharedModule { }
