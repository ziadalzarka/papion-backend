import { GraphQLException } from '@gray/graphql-essentials';

export class ReviewDuplicatedException extends GraphQLException {
  constructor() {
    super('User cannot post more than one review per service', 'review/duplicated');
  }
}
