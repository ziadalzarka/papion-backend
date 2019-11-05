import { Args, Query, Resolver } from '@nestjs/graphql';
import { ServiceService } from 'app/service/service.service';
import { MultipleSearchPayloadInput, SearchPayloadInput, ServiceSearchOutput } from './search.dto';

@Resolver()
export class ServiceResolver {
  constructor(private serviceService: ServiceService) { }

  @Query(returns => ServiceSearchOutput)
  async search(@Args({ name: 'payload', type: () => SearchPayloadInput }) payload: SearchPayloadInput) {
    return await this.serviceService.searchServices(payload);
  }

  @Query(returns => [ServiceSearchOutput])
  async searchMultiple(@Args({ name: 'payload', type: () => MultipleSearchPayloadInput }) payload: MultipleSearchPayloadInput) {
    const results = [];
    for (const searchPayload of payload.overrides) {
      const page = await this.serviceService.searchServices({ ...payload.defaults, ...searchPayload.payload });
      results.push({ ...page, key: searchPayload.key });
    }
    return results;
  }
}
