import { Test, TestingModule } from '@nestjs/testing';
import { PlaceBusinessReservationResolver } from './place-business-reservation.resolver';

describe('PlaceBusinessReservationResolver', () => {
  let resolver: PlaceBusinessReservationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceBusinessReservationResolver],
    }).compile();

    resolver = module.get<PlaceBusinessReservationResolver>(PlaceBusinessReservationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
