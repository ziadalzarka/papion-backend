import { GraphQLException } from '@gray/graphql-essentials';

export class ReviewNotFoundException extends GraphQLException {
  constructor() {
    super('Review not found', 'review/not-found');
  }
}
