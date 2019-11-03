import { Test, TestingModule } from '@nestjs/testing';
import { PersonResolverResolver } from 'app/service/person-resolver.resolver';

describe('PersonResolverResolver', () => {
  let resolver: PersonResolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonResolverResolver],
    }).compile();

    resolver = module.get<PersonResolverResolver>(PersonResolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
