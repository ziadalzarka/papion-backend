import { GraphQLException } from '@gray/graphql-essentials';

export class ServiceNotFoundException extends GraphQLException {
  constructor() {
    super('Service does not exist!', 'business-service/not-found');
  }
}
