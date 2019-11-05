import { Test, TestingModule } from '@nestjs/testing';
import { PersonBusinessReservationResolver } from './person-business-reservation.resolver';

describe('PersonBusinessReservationResolver', () => {
  let resolver: PersonBusinessReservationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonBusinessReservationResolver],
    }).compile();

    resolver = module.get<PersonBusinessReservationResolver>(PersonBusinessReservationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
