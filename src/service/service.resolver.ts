import { ServiceService } from 'app/service/service.service';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ServiceEntity } from './service.dto';
import { SearchPayloadInput } from './search.dto';

@Resolver()
export class ServiceResolver {
  constructor(private serviceService: ServiceService) { }

  @Query(returns => [ServiceEntity])
  async search(@Args({ name: 'payload', type: () => SearchPayloadInput }) payload: SearchPayloadInput) {
    return this.serviceService.searchServices(payload);
  }
}
