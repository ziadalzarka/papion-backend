import { registerEnumType } from 'type-graphql';

export enum NotificationType {
  WeddingWebsiteCreated = 'wedding_website_created',
  BusinessRepliedToReservation = 'reservation_responded',
}

registerEnumType(NotificationType, { name: 'NotificationType' });
