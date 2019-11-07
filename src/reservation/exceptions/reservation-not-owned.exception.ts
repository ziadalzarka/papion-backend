import { GraphQLException } from '@gray/graphql-essentials';

export class ReservationNotOwnedException extends GraphQLException {
  constructor() {
    super('Reservation was not made by client so mutations can be performed on it!', 'reservation/not-owned');
  }
}
