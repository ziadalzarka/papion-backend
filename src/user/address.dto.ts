import { City } from './city.dto';
import { Country } from './country.dto';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class Coordinates {
  @Field()
  lat?: number;
  @Field()
  long?: number;
}

@ObjectType()
export class Address {
  @Field(type => Country)
  country?: Country;
  @Field(type => City)
  city?: City;
  @Field({ nullable: true })
  street?: string;
  @Field(type => Coordinates, { nullable: true })
  coords?: Coordinates;
}

@InputType()
export class AddressCoordinatesInput {
  @Field()
  lat: number;
  @Field()
  long: number;
}

@InputType()
export class UpdateAddressCoordinatesInput {
  @Field({ nullable: true })
  lat?: number;
  @Field({ nullable: true })
  long?: number;
}

@InputType()
export class AddressInput {
  @Field(type => Country)
  country: Country;
  @Field(type => City)
  city: City;
  @Field({ nullable: true })
  street?: string;
  @Field(type => AddressCoordinatesInput, { nullable: true })
  coords?: AddressCoordinatesInput;
}

@InputType()
export class UpdateAddressInput {
  @Field(type => Country, { nullable: true })
  country?: Country;
  @Field(type => City, { nullable: true })
  city?: City;
  @Field({ nullable: true })
  street?: string;
  @Field(type => UpdateAddressCoordinatesInput, { nullable: true })
  coords?: UpdateAddressCoordinatesInput;
}
