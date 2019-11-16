import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ResultsPage<T = any> {
  edges: T[];
  @Field()
  pages: number;
  @Field()
  hasNext: boolean;
  @Field()
  total: number;
}
