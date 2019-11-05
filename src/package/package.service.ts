import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './package.schema';

@Injectable()
export class PackageService {

  constructor(@InjectModel('Package') private packageModel: Model<Package>) { }

  list(projection = {}) {
    return this.packageModel.find({}, projection);
  }

}
