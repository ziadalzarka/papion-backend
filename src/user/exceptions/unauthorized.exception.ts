import { GraphQLException } from 'app/graphql.exception';

export class UnauthorizedException extends GraphQLException {
  constructor() {
    super('User access is not authorized', 'auth/unauthenticated');
  }
}
