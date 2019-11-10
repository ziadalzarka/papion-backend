import { GraphQLException } from '@gray/graphql-essentials';

export class UserRequestsCannotBeDeletedException extends GraphQLException {
  constructor() {
    super('User requests cannot be deleted! Only manually marked reservations can be deleted!', 'service-calendar/cannot-delete-user-request');
  }
}
