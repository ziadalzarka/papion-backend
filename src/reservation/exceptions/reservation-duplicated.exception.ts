import { GraphQLException } from '@gray/graphql-essentials';

export class ReservationDuplicatedException extends GraphQLException {
  constructor() {
    super('Reservation has been submitted before!', 'reservation/duplicate');
  }
}
