import { Upload } from './upload.scalar';
import { Module } from '@nestjs/common';

@Module({
  imports: [Upload],
  providers: [],
  exports: [Upload],
})
export class GraphqlEssentialsModule { }
