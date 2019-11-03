import { registerEnumType } from 'type-graphql';

export enum SortKey {
  Ascending = 'asc',
  Descending = 'desc',
}

registerEnumType(SortKey, { name: 'SortKey' });
