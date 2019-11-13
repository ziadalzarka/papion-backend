import { GraphQLException } from '@gray/graphql-essentials';

export class WeddingWebsiteNotOwnedException extends GraphQLException {
  constructor() {
    super('Wedding website not owned!', 'wedding-website/not-owned');
  }
}
