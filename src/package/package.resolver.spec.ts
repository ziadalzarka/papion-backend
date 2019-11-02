import { Test, TestingModule } from '@nestjs/testing';
import { PackageResolver } from './package.resolver';

describe('PackageResolver', () => {
  let resolver: PackageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackageResolver],
    }).compile();

    resolver = module.get<PackageResolver>(PackageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
