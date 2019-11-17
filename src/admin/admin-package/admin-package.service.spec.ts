import { Test, TestingModule } from '@nestjs/testing';
import { AdminPackageService } from './admin-package.service';

describe('AdminPackageService', () => {
  let service: AdminPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPackageService],
    }).compile();

    service = module.get<AdminPackageService>(AdminPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
