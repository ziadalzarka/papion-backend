import { registerEnumType } from 'type-graphql';

export enum NotificationType {
  WeddingWebsiteCreated = 'wedding_website_created',
  BusinessRepliedToReservation = 'reservation_responded',
  PapionUserSubmittedReservationRequest = 'reservation_request',
}

registerEnumType(NotificationType, { name: 'NotificationType' });
