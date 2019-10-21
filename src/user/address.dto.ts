import { City } from 'app/user/city.dto';
import { Country } from 'app/user/country.dto';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class Address {
  @Field(type => Country)
  country: Country;
  @Field(type => City)
  city: City;
  @Field({ nullable: true })
  street?: string;
}

@InputType()
export class AddressInput {
  @Field(type => Country)
  country: Country;
  @Field(type => City)
  city: City;
  @Field({ nullable: true })
  street?: string;
}
