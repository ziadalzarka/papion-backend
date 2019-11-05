import { GraphQLException } from '@gray/graphql-essentials';

export class ReservationDayPassedException extends GraphQLException {
  constructor() {
    super('Reservation day has already passed!', 'reservation/date-passed');
  }
}
