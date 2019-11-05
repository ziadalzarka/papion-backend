import { SortKey } from './sort-key.dto';
import { ServiceSearchOrderBy } from './service-search-order-by.dto';
import { InputType, Field, ObjectType } from 'type-graphql';
import { BusinessCategory } from 'app/user/business-category.dto';
import { Package } from 'app/package/package.schema';
import { PersonCategory, PlaceCategory, ServiceCategory } from './category.dto';
import { PackagePriority } from 'app/package/package.interface';
import { Country } from 'app/user/country.dto';
import { City } from 'app/user/city.dto';
import { ResultsPage } from '@gray/graphql-essentials/page.dto';
import { ServiceEntity } from './service.dto';

@InputType()
export class PriceRangeInput {
  @Field()
  startPrice: number;
  @Field()
  endPrice: number;
}

@InputType()
export class SearchPayloadInput {
  @Field({ nullable: true })
  query?: string;
  @Field(type => ServiceCategory, { nullable: true })
  category?: ServiceCategory;
  @Field(type => PriceRangeInput, { nullable: true })
  priceRange?: PriceRangeInput;
  @Field(type => [PackagePriority], { nullable: true })
  packagePriority?: PackagePriority;
  @Field(type => Country, { nullable: true })
  country?: Country;
  @Field(type => City, { nullable: true })
  city?: City;
  @Field({ nullable: true })
  page?: number;
  @Field(type => ServiceSearchOrderBy, { nullable: true })
  orderBy?: ServiceSearchOrderBy;
  @Field(type => SortKey, { nullable: true })
  sortKey?: SortKey;
}

@InputType()
export class SearchPayloadOverrideInput {
  @Field()
  key: string;
  @Field(type => SearchPayloadInput)
  payload: SearchPayloadInput;
}

@InputType()
export class MultipleSearchPayloadInput {
  @Field(type => SearchPayloadInput)
  defaults: SearchPayloadInput;
  @Field(type => [SearchPayloadOverrideInput])
  overrides: SearchPayloadOverrideInput[];
}

@ObjectType()
export class ServiceSearchOutput implements ResultsPage<typeof ServiceEntity> {
  @Field({ nullable: true })
  key?: string;
  @Field(type => [ServiceEntity])
  edges: Array<typeof ServiceEntity>;
  @Field()
  hasNext: boolean;
  @Field()
  pages: number;
}
