import { GraphQLException } from '@gray/graphql-essentials';

export class WeddingWebsitesDisabledException extends GraphQLException {
  constructor() {
    super('Wedding websites are disabled for service!', 'wedding-websites/disabled');
  }
}
