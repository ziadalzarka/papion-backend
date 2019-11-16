import { ReviewComment, IReviewComment } from './review-comment.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';

@Injectable()
export class ReviewCommentService {

  constructor(@InjectModel('ReviewComment') private reviewCommentModel: Model<ReviewComment>) { }

  async createReviewComment(payload: Partial<IReviewComment>) {
    return await new this.reviewCommentModel(payload).save();
  }

  async listReviewComments(query: Partial<IReviewComment>, page: number, projection = {}) {
    return await performPaginatableQuery(this.reviewCommentModel, query, { _id: -1 }, page, projection);
  }
}
