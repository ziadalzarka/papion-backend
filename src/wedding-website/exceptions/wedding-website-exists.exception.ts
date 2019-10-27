import { GraphQLException } from '@gray/graphql-essentials';

export class WeddingWebsiteExistsException extends GraphQLException {
  constructor() {
    super('Wedding website already exists!', 'wedding/exists');
  }
}
