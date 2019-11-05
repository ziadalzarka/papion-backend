import { TemplateEntity } from './template.dto';
import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';

@schema({})
export class ITemplate {
  @field
  name: string;
  @field
  preview_url: string;
  @field
  stylesheet_url: string;
}

export const TemplateSchema = buildSchema(ITemplate);

mongoose.model('Template', TemplateSchema);

export type Template = ITemplate & mongoose.Document;
