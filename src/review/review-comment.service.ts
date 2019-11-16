import { ReviewComment, IReviewComment } from './review-comment.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ObjectID } from 'bson';

@Injectable()
export class ReviewCommentService {

  constructor(@InjectModel('ReviewComment') private reviewCommentModel: Model<ReviewComment>) { }

  async createReviewComment(payload: Partial<IReviewComment>) {
    return await new this.reviewCommentModel(payload).save();
  }

  async listReviewComments(query: Partial<IReviewComment>, page: number, projection = {}) {
    return await performPaginatableQuery(this.reviewCommentModel, query, { _id: -1 }, page, projection);
  }

  async findOne(query: Partial<IReviewComment>, projection = {}) {
    return await this.reviewCommentModel.findOne(query, projection);
  }

  async updateReviewComment(id: ObjectID, payload: Partial<IReviewComment>, projection = {}) {
    return await this.reviewCommentModel.findByIdAndUpdate(id, payload, { new: true, select: projection });
  }

  async deleteReviewComment(id: ObjectID, projection = {}) {
    return await this.reviewCommentModel.findByIdAndDelete(id, { select: projection });
  }
}
