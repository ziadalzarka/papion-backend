import { ApolloError } from 'apollo-server-core';

export class GraphQLException extends ApolloError {

  readonly context;

  constructor(message, code, context?) {
    super(message, code, { code, context });
  }
}
