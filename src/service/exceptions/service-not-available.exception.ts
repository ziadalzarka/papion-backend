import { GraphQLException } from '@gray/graphql-essentials';

export class ServiceNotAvailableException extends GraphQLException {
  constructor() {
    super('You cannot submit a reservation request to this service because it either does not exist or is not published!', 'service/not-available');
  }
}
