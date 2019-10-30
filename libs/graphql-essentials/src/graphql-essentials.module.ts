import { UploadsModule } from '@gray/uploads';
import { File } from './file.scalar';
import { Module } from '@nestjs/common';
import { SharedModule } from 'app/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [File],
  exports: [File],
})
export class GraphqlEssentialsModule { }
