import { GraphQLException } from '@gray/graphql-essentials';

export class UserNotFoundException extends GraphQLException {
  constructor() {
    super('User not found', 'auth/user-not-found');
  }
}
