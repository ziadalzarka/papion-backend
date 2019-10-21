import { registerEnumType } from 'type-graphql';

export enum Country {
  Egypt = 'egypt',
}

registerEnumType(Country, { name: 'Country' });
