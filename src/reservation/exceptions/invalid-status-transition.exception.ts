import { GraphQLException } from '@gray/graphql-essentials';

export class InvalidReservationStatusTransitionException extends GraphQLException {
  constructor() {
    super('Invalid reservation status transition', 'reservation/invalid-status-transition');
  }
}
