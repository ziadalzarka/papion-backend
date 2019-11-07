import { InputType, Field } from 'type-graphql';
import { ObjectID } from 'mongodb';
import { ReservationStatus } from 'app/reservation/reservation.dto';

@InputType()
export class BusinessReservationResponseInput {
  @Field()
  accepted: boolean;
  @Field()
  startingPrice: number;
  @Field(type => [Date])
  availableDates: Date[];
  @Field()
  notes: string;
}

@InputType()
export class RespondToReservationInput {
  @Field(type => ObjectID)
  id: ObjectID;
  @Field(type => BusinessReservationResponseInput)
  data: BusinessReservationResponseInput;
}

@InputType()
export class PersonBusinessCalendarQueryInput {
  @Field(type => Date)
  from: Date;
  @Field(type => Date)
  to: Date;
  @Field(type => [ReservationStatus], { nullable: true })
  statuses?: ReservationStatus[];
}

@InputType()
export class PlaceBusinessCalendarQueryInput extends PersonBusinessCalendarQueryInput {
  @Field(type => ObjectID)
  serviceId: ObjectID;
}

@InputType()
export class BusinessCalendarQueryInput extends PlaceBusinessCalendarQueryInput { }
