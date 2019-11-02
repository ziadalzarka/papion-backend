import { UploadsModule } from '@gray/uploads';
import { File } from './file.scalar';
import { Module } from '@nestjs/common';
import { SharedModule } from 'app/shared/shared.module';
import { ObjectIDScalar } from './graphql-objectid.scalar';

@Module({
  imports: [SharedModule],
  providers: [File, ObjectIDScalar],
  exports: [File, ObjectIDScalar],
})
export class GraphqlEssentialsModule { }
