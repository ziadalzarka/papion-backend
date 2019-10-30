import { UploadService } from '@gray/uploads/uploads.service';
import { GraphQLUpload } from 'graphql-upload';
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';

@Scalar('File', type => File)
export class File implements CustomScalar<any, any> {
  description = 'File upload scalar type';

  constructor(private uploadService: UploadService) { }

  async parseValue(value) {
    const parsed = await GraphQLUpload.parseValue(value);
    return await this.uploadService.uploadFile(parsed);
  }

  serialize(value) {
    return value;
  }

  parseLiteral(ast: ValueNode) {
    return GraphQLUpload.parseLiteral(ast, {});
  }
}
