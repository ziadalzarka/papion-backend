import { GraphQLException } from '@gray/graphql-essentials';

export class ReservationNotConfirmedException extends GraphQLException {
  constructor() {
    super('Reservation is not yet confirmed by the business owner!', 'reservation/not-confirmed');
  }
}
