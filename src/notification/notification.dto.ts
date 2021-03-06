import { ResultsPage } from './../../libs/graphql-essentials/src/page.dto';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { ReservationEntity } from 'app/reservation/reservation.dto';
import { WeddingWebsiteEntity } from 'app/wedding-website/wedding-website.dto';
import { createUnionType, Field, ObjectType } from 'type-graphql';
import { NotificationType } from './notification-type.dto';
import { ObjectID } from 'mongodb';

export const RequiredNotificationProjection = {
  reservationDay: true,
  subdomain: true,
};

export const NotificationData = createUnionType({
  name: 'NotificationData',
  types: [ReservationEntity, WeddingWebsiteEntity],
  resolveType: (value: any) => {
    if (value.reservationDay) {
      return 'ReservationEntity';
    } else if (value.subdomain) {
      return 'WeddingWebsiteEntity';
    }
  },
});

@ObjectType()
export class NotificationEntity extends DatabaseEntity {
  @Field(type => NotificationType)
  notificationType: NotificationType;
  @Field(type => NotificationData)
  data: typeof NotificationData;
  @Field(type => ObjectID)
  dataRef: ObjectID;
  @Field(type => Date)
  addedAt: Date;
  @Field()
  seen: boolean;
}

@ObjectType()
export class NotificationEntityPage extends ResultsPage {
  @Field(type => [NotificationEntity])
  edges: NotificationEntity[];
  @Field()
  pages: number;
  @Field()
  hasNext: boolean;
}
