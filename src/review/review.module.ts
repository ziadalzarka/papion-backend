import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './review.schema';
import { ReviewCommentSchema } from './review-comment.schema';
import { ServiceModule } from 'app/service/service.module';
import { ReviewCommentService } from './review-comment.service';
import { PersonBusinessReviewResolver } from './person-business-review.resolver';
import { PlaceBusinessReviewResolver } from './place-business-review.resolver';
import { ReviewCommentResolver } from './review-comment.resolver';
import { UserModule } from 'app/user';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'ReviewComment', schema: ReviewCommentSchema },
    ]),
    ServiceModule,
  ],
  providers: [
    ReviewService,
    ReviewCommentService,
    ReviewResolver,
    PersonBusinessReviewResolver,
    PlaceBusinessReviewResolver,
    ReviewCommentResolver,
  ],
})
export class ReviewModule { }
