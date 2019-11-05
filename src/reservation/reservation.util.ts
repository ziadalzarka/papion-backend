import { ReservationStatus } from './reservation.dto';

const SortedReservationStatus = [
  ReservationStatus.Reserved,
  ReservationStatus.Responded,
  ReservationStatus.Pending,
  ReservationStatus.Denied,
  ReservationStatus.Canceled,
  ReservationStatus.Closed,
];

export const statusNumberToString = (index) => {
  return SortedReservationStatus[index];
};

export const statusStringToNumber = (status) => {
  return SortedReservationStatus.indexOf(status);
};
