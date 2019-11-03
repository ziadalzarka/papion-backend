import { GraphQLException } from '@gray/graphql-essentials';

export class ServiceNotOwnedException extends GraphQLException {
  constructor() {
    super('You do not own this service to perform mutations on it!', 'business-service/not-owned');
  }
}
