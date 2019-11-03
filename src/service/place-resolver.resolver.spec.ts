import { Test, TestingModule } from '@nestjs/testing';
import { PlaceResolverResolver } from 'app/service/place-resolver.resolver';

describe('PlaceResolverResolver', () => {
  let resolver: PlaceResolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceResolverResolver],
    }).compile();

    resolver = module.get<PlaceResolverResolver>(PlaceResolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
