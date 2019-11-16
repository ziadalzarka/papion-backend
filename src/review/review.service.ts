import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, IReview } from './review.schema';
import { ObjectID } from 'bson';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ReviewNotFoundException } from './exceptions/review-not-found.exception';

@Injectable()
export class ReviewService {
  constructor(@InjectModel('Review') private reviewModel: Model<Review>) { }

  async createReview(payload: Partial<IReview>) {
    return await new this.reviewModel(payload).save();
  }

  async validateReviewExists(query: Partial<IReview>) {
    const doc = await this.reviewModel.exists(query);
    if (!doc) {
      throw new ReviewNotFoundException();
    }
  }

  async findOne(query: Partial<IReview>, projection = {}) {
    return await this.reviewModel.findOne(query, projection);
  }

  async listReviews(query: Partial<IReview>, page: number, projection = {}) {
    return await performPaginatableQuery(this.reviewModel, query, { rating: -1 }, page, projection);
  }

  async updateReview(id: ObjectID, payload: Partial<IReview>, projection = {}) {
    return await this.reviewModel.findByIdAndUpdate(id, payload, { new: true, select: projection });
  }

  async deleteReview(id: ObjectID, projection = {}) {
    return await this.reviewModel.findByIdAndDelete(id, { select: projection });
  }
}
