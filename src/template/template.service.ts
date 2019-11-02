import { ObjectID } from 'mongodb';
import { Template } from './template.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TemplateDoesNotExistException } from './exceptions/template-does-not-exist.exception';

@Injectable()
export class TemplateService {
  constructor(@InjectModel('Template') private templateModel: Model<Template>) { }

  async validateTemplateUsable(_id: ObjectID) {
    console.log(_id);
    const exists = await this.templateModel.exists({ _id });
    Logger.debug('It exists');
    if (!exists) {
      throw new TemplateDoesNotExistException();
    }
  }

  list() {
    return this.templateModel.find({});
  }

  _resolveTemplate(_id: ObjectID) {
    return this.templateModel.findById(_id);
  }
}
