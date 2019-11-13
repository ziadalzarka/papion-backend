import { GraphQLException } from '@gray/graphql-essentials';

export class UserResetCodeExpiredException extends GraphQLException {
  constructor() {
    super('User password reset code expired', 'auth/reset-code-expired');
  }
}
