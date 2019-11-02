import { Template } from './template.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TemplateService {
  constructor(@InjectModel('Template') private templateModel: Model<Template>) { }

  list() {
    return this.templateModel.find({});
  }
}
