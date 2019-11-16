import { Test, TestingModule } from '@nestjs/testing';
import { PlaceBusinessReviewResolver } from './place-business-review.resolver';

describe('PlaceBusinessReviewResolver', () => {
  let resolver: PlaceBusinessReviewResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceBusinessReviewResolver],
    }).compile();

    resolver = module.get<PlaceBusinessReviewResolver>(PlaceBusinessReviewResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
