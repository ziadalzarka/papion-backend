import { Test, TestingModule } from '@nestjs/testing';
import { AdminPackageResolver } from './admin-package.resolver';

describe('AdminPackageResolver', () => {
  let resolver: AdminPackageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPackageResolver],
    }).compile();

    resolver = module.get<AdminPackageResolver>(AdminPackageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
