import { Test, TestingModule } from '@nestjs/testing';
import { PersonBusinessReviewResolver } from './person-business-review.resolver';

describe('PersonBusinessReviewResolver', () => {
  let resolver: PersonBusinessReviewResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonBusinessReviewResolver],
    }).compile();

    resolver = module.get<PersonBusinessReviewResolver>(PersonBusinessReviewResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
