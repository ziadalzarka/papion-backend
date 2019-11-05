import { registerEnumType } from 'type-graphql';

export enum City {
  Damanhur = 'damanhur',
  Alexandria = 'alexandria',
  Cairo = 'cairo',
}

registerEnumType(City, { name: 'City' });
