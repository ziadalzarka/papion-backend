import { Test, TestingModule } from '@nestjs/testing';
import { BusinessReservationService } from 'app/business-cpanel/business-reservation/business-reservation.service';

describe('BusinessReservationService', () => {
  let service: BusinessReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessReservationService],
    }).compile();

    service = module.get<BusinessReservationService>(BusinessReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
