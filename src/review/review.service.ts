import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, IReview } from './review.schema';
import { ObjectID } from 'bson';
import { performPaginatableQuery } from '@gray/graphql-essentials/paginatable';
import { ReviewNotFoundException } from './exceptions/review-not-found.exception';
import { ServiceService } from 'app/service/service.service';
import { ReviewDuplicatedException } from './exceptions/review-duplicated.exception';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private reviewModel: Model<Review>,
    private serviceService: ServiceService) { }

  async createReview(payload: Partial<IReview>) {
    const doc = await new this.reviewModel(payload).save();
    await this.calculateRating(payload.service as ObjectID);
    return doc;
  }

  async validateReviewExists(query: Partial<IReview>) {
    const doc = await this.reviewModel.exists(query);
    if (!doc) {
      throw new ReviewNotFoundException();
    }
  }

  async validateReviewNotDuplicated(query: Partial<IReview>) {
    const exists = await this.reviewModel.exists(query);
    if (exists) {
      // throw new ReviewDuplicatedException();
    }
  }

  async findOne(query: Partial<IReview>, projection = {}) {
    return await this.reviewModel.findOne(query, projection);
  }

  async listReviews(query: Partial<IReview>, page: number, projection = {}) {
    return await performPaginatableQuery(this.reviewModel, query, { rating: -1 }, page, projection);
  }

  async updateReview(id: ObjectID, payload: Partial<IReview>, projection = {}) {
    if (Object.keys(projection).length > 0) {
      projection = { ...projection, service: true };
    }
    const doc = await this.reviewModel.findByIdAndUpdate(id, payload, { new: true, select: projection });
    await this.calculateRating(doc.service as ObjectID);
    return doc;
  }

  async deleteReview(id: ObjectID, projection = {}) {
    if (Object.keys(projection).length > 0) {
      projection = { ...projection, service: true };
    }
    const doc = await this.reviewModel.findByIdAndDelete(id, { select: projection }) as any;
    await this.calculateRating(doc.service);
    return doc;
  }

  async calculateRating(service: ObjectID) {
    const [{ rating }] = await this.reviewModel.aggregate([
      { $match: { service } },
      { $group: { _id: '$service', rating: { $avg: '$rating' } } },
    ]);
    await this.serviceService.updateService(service, { rating });
  }
}
