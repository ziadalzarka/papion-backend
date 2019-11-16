import { GraphQLException } from '@gray/graphql-essentials';

export class ReviewNotOwnedException extends GraphQLException {
  constructor() {
    super('Review not owned', 'review/not-owned');
  }
}
