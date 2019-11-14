import { GraphQLException } from '@gray/graphql-essentials';

export class OldPasswordDoesNotMatchException extends GraphQLException {
  constructor() {
    super('Old password does not match! It is required in order to change either user password or email!', 'auth/old-password-no-match');
  }
}
