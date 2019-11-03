import { AuthenticationScope } from 'app/user/token.interface';
import { GraphQLException } from '@gray/graphql-essentials';

export class MissingScopesException extends GraphQLException {
  constructor(scopes: AuthenticationScope[]) {
    super('User access is not authorized', 'auth/missing-scopes', { scopes });
  }
}
