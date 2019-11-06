import { ObjectID } from 'mongodb';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { ObjectType, InputType, Field, registerEnumType } from 'type-graphql';
import { ServiceEntity } from 'app/service/service.dto';
import { ResultsPage } from '@gray/graphql-essentials/page.dto';
import { ClientUserEntity } from 'app/user/user.dto';

@ObjectType()
export class ReservationEntity extends DatabaseEntity {
  @Field(type => ServiceEntity)
  service: typeof ServiceEntity;
  @Field()
  reservationDay: Date;
  @Field()
  notes: string;
  @Field(type => ReservationStatus)
  status: ReservationStatus;
  @Field(type => ClientUserEntity)
  client: ClientUserEntity;
}

export enum ReservationStatus {
  Reserved = 'reserved',
  Responded = 'responded',
  Pending = 'pending',
  Denied = 'denied',
  Canceled = 'canceled',
  Closed = 'closed',
}

registerEnumType(ReservationStatus, { name: 'ReservationStatus' });

@InputType()
export class ReserveServiceInput {
  @Field()
  reservationDay: Date;
  @Field()
  notes: string;
  @Field()
  service: ObjectID;
}

@ObjectType()
export class ReservationsPage implements ResultsPage<typeof ReservationEntity> {
  @Field(type => [ReservationEntity])
  edges: Array<typeof ReservationEntity>;
  @Field()
  hasNext: boolean;
  @Field()
  pages: number;
}
