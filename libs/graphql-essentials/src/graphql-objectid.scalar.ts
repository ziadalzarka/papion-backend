import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';
import { Kind } from 'graphql';
import { ObjectID } from 'mongodb';

@Scalar('ObjectID', type => ObjectID)
export class ObjectIDScalar implements CustomScalar<string, ObjectID> {
  description = 'Mongo ObjectID scalar type';

  constructor() { }

  parseValue(value: string): ObjectID {
    return ObjectID.createFromHexString(value);
  }

  serialize(value: ObjectID): string {
    return value.toHexString();
  }

  parseLiteral(ast: ValueNode): ObjectID {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }
    return null;
  }
}
