import { SortKey } from './sort-key.dto';
import { ServiceSearchOrderBy } from './service-search-order-by.dto';
import { InputType, Field } from 'type-graphql';
import { BusinessCategory } from 'app/user/business-category.dto';
import { Package } from 'app/package/package.schema';
import { PersonCategory, PlaceCategory, ServiceCategory } from './category.dto';
import { PackagePriority } from 'app/package/package.interface';
import { Country } from 'app/user/country.dto';
import { City } from 'app/user/city.dto';

@InputType()
export class PriceRangeInput {
  @Field()
  startPrice: number;
  @Field()
  endPrice: number;
}

@InputType()
export class SearchPayloadInput {
  @Field()
  query: string;
  @Field(type => ServiceCategory)
  category: ServiceCategory;
  @Field(type => PriceRangeInput)
  priceRange: PriceRangeInput;
  @Field(type => [PackagePriority])
  packagePriority: PackagePriority;
  @Field(type => Country)
  country: Country;
  @Field(type => City)
  city: City;
  @Field()
  page: number;
  @Field(type => ServiceSearchOrderBy)
  orderBy: ServiceSearchOrderBy;
  @Field(type => SortKey)
  sortKey: SortKey;
}
