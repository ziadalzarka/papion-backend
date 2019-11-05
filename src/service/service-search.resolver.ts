import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { MultipleSearchPayloadInput, SearchPayloadInput, ServiceSearchOutput } from 'app/service/search.dto';
import { ServiceService } from 'app/service/service.service';
import { GraphQLResolveInfo } from 'graphql';

@Resolver()
export class ServiceSearchResolver {
  constructor(private serviceService: ServiceService) { }

  @Query(returns => ServiceSearchOutput)
  async search(@Args({ name: 'payload', type: () => SearchPayloadInput }) payload: SearchPayloadInput, @Info() info: GraphQLResolveInfo) {
    return await this.serviceService.searchServices(payload, graphqlMongodbProjection(info));
  }

  @Query(returns => [ServiceSearchOutput])
  async searchMultiple(
    @Args({ name: 'payload', type: () => MultipleSearchPayloadInput }) payload: MultipleSearchPayloadInput,
    @Info() info: GraphQLResolveInfo) {
    const results = [];
    for (const searchPayload of payload.overrides) {
      const page = await this.serviceService.searchServices({ ...payload.defaults, ...searchPayload.payload }, graphqlMongodbProjection(info));
      results.push({ ...page, key: searchPayload.key });
    }
    return results;
  }
}
