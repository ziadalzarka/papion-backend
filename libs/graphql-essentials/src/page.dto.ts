import { ObjectType, Field } from 'type-graphql';

export interface ResultsPage<T = any> {
  items: T[];
  pages: number;
  hasNext: boolean;
}
