import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ServiceStatistics {
  @Field()
  searchHits: number;
  @Field()
  pageHits: number;
  @Field()
  onGoingRequests: number;
  @Field()
  reservations: number;
}
