import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, IPackage } from 'app/package/package.schema';
import { ObjectID } from 'bson';

@Injectable()
export class AdminPackageService {

  constructor(@InjectModel('Package') private packageModel: Model<Package>) { }

  async createPackage(payload: Partial<IPackage>) {
    return await new this.packageModel(payload).save();
  }

  async updatePackage(id: ObjectID, payload: Partial<IPackage>, projection = {}) {
    return await this.packageModel.findByIdAndUpdate(id, payload, { new: true, select: projection });
  }

  async deletePackage(id: ObjectID, projection = {}) {
    return await this.packageModel.findByIdAndDelete(id, { select: projection });
  }
}
