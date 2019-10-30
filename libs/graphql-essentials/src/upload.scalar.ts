import { Scalar } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@Scalar('Upload', type => GraphQLUpload)
export class Upload {
  description = 'Upload custom scalar type';

  parseValue(value) {
    console.log({ parseValue: value });
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any) {
    console.log({ serialize: value });
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    console.log({ ast });
    return GraphQLUpload.parseLiteral(ast, {});
  }
}
