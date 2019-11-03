import { registerEnumType } from 'type-graphql';

export enum City {
  Damanhur = 'damanhur',
}

registerEnumType(City, { name: 'City' });
