import { ObjectType, Field } from 'type-graphql';

export interface ResultsPage<T = any> {
  edges: T[];
  pages: number;
  hasNext: boolean;
}
