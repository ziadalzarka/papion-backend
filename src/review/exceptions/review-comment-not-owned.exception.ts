import { GraphQLException } from '@gray/graphql-essentials';

export class ReviewCommentNotOwnedException extends GraphQLException {
  constructor() {
    super('Review comment not owned', 'review/comment-not-owned');
  }
}
