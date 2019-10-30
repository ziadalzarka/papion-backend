import { Module, DynamicModule } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3_CONFIGURATION } from './s3.constants';
import { S3Configuration } from './s3.interface';

@Module({})
export class S3Module {
  static forRoot(config: S3Configuration): DynamicModule {
    return {
      module: S3Module,
      providers: [
        {
          provide: S3_CONFIGURATION,
          useValue: config,
        },
        S3Service,
      ],
      exports: [S3Service],
    };
  }
}
