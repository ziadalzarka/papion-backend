import { registerEnumType } from 'type-graphql';

export enum ServiceSearchOrderBy {
  Price = 'price',
  Rating = 'rating',
  Time = 'time',
  Popularity = 'popularity',
  AddedAt = 'added_at',
}

registerEnumType(ServiceSearchOrderBy, { name: 'ServiceSearchOrderBy' });
