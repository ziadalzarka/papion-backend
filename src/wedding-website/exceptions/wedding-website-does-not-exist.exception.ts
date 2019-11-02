import { GraphQLException } from '@gray/graphql-essentials';

export class WeddingWebsiteDoesNotExistException extends GraphQLException {
  constructor() {
    super('Wedding website does not exist!', 'wedding-website/does-not-exist');
  }
}
