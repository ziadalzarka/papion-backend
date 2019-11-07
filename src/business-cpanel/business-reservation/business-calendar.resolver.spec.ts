import { Test, TestingModule } from '@nestjs/testing';
import { BusinessCalendarResolver } from 'app/business-cpanel/business-reservation/business-calendar.resolver';

describe('BusinessCalendarResolver', () => {
  let resolver: BusinessCalendarResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessCalendarResolver],
    }).compile();

    resolver = module.get<BusinessCalendarResolver>(BusinessCalendarResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
