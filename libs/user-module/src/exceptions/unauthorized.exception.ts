import { GraphQLException } from '@gray/graphql-essentials';

export class UnauthorizedException extends GraphQLException {
  constructor() {
    super('User access is not authorized', 'auth/unauthenticated');
  }
}
