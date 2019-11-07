import { Test, TestingModule } from '@nestjs/testing';
import { BusinessReservationResolver } from './business-reservation.resolver';

describe('BusinessReservationResolver', () => {
  let resolver: BusinessReservationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessReservationResolver],
    }).compile();

    resolver = module.get<BusinessReservationResolver>(BusinessReservationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
