import { Test, TestingModule } from '@nestjs/testing';
import { ReviewCommentResolver } from './review-comment.resolver';

describe('ReviewCommentResolver', () => {
  let resolver: ReviewCommentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewCommentResolver],
    }).compile();

    resolver = module.get<ReviewCommentResolver>(ReviewCommentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
