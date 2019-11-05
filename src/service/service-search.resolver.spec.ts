import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSearchResolver } from 'app/service/service-search.resolver';

describe('ServiceResolver', () => {
  let resolver: ServiceSearchResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceSearchResolver],
    }).compile();

    resolver = module.get<ServiceSearchResolver>(ServiceSearchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
