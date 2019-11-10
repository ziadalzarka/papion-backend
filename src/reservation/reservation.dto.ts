import { ObjectID } from 'mongodb';
import { DatabaseEntity } from '@gray/graphql-essentials';
import { ObjectType, InputType, Field, registerEnumType } from 'type-graphql';
import { ServiceEntity, PlaceServiceEntity } from 'app/service/service.dto';
import { ResultsPage } from '@gray/graphql-essentials/page.dto';
import { ClientUserEntity } from 'app/user/user.dto';

@ObjectType()
export class ReservationResponse {
  @Field()
  accepted: boolean;
  @Field()
  startingPrice: number;
  @Field(type => [Date])
  availableDates: Date[];
  @Field()
  notes: string;
}

@ObjectType()
export class ReservationEntity extends DatabaseEntity {
  @Field(type => ServiceEntity)
  service: typeof ServiceEntity | any;
  @Field()
  reservationDay: Date;
  @Field()
  notes: string;
  @Field(type => ReservationStatus)
  status: ReservationStatus;
  @Field(type => ClientUserEntity, { nullable: true })
  client?: ClientUserEntity;
  @Field(type => ReservationResponse, { nullable: true })
  response?: ReservationResponse;
}

@ObjectType()
export class PlaceBusinessReservationEntity extends ReservationEntity {
  @Field(type => PlaceServiceEntity)
  service: typeof PlaceServiceEntity;
}

@ObjectType()
export class PlaceBusinessReservationEntityPage implements ResultsPage {
  @Field(type => [PlaceBusinessReservationEntity])
  edges: PlaceBusinessReservationEntity[];
  @Field()
  pages: number;
  @Field()
  hasNext: boolean;
}

export enum ReservationStatus {
  Reserved = 'reserved',
  PendingConfirmation = 'pending_confirmation',
  Responded = 'responded',
  Pending = 'pending',
  ClientRefused = 'client_refused',
  BusinessRefused = 'business_refused',
  LeftUnconfirmed = 'left_unconfirmed',
  Canceled = 'canceled',
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
