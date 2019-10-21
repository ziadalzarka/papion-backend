import { registerEnumType } from 'type-graphql';

export enum BusinessCategory {
  Place = 'place',
  Person = 'person',
}

registerEnumType(BusinessCategory, { name: 'BusinessCategory' });
