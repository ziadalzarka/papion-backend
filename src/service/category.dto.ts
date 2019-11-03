import { registerEnumType } from 'type-graphql';

export enum PlaceCategory {
  Hotel = 'hotel',
  OpenAir = 'open_air',
  Hall = 'hall',
}

export enum PersonCategory {
  Photographer = 'photographer',
  WeddingPlanner = 'wedding_planner',
}

export const ServiceCategory = {
  ...PlaceCategory,
  ...PersonCategory,
};

export type ServiceCategory = PlaceCategory | PersonCategory;

registerEnumType(PlaceCategory, { name: 'PlaceCategory' });
registerEnumType(PersonCategory, { name: 'PersonCategory' });
registerEnumType(ServiceCategory, { name: 'ServiceCategory' });
