import { PackageEntity } from './package.dto';
import { schema, field, buildSchema, unique } from 'mongoose-schema-decorators';
import * as mongoose from 'mongoose';
import { PackagePriority } from './package.interface';

@schema({})
export class IPackage {
  @field
  name: string;
  @field
  priority: PackagePriority;
  @field
  price: number;
  @field
  description: string;
}

export const PackageSchema = buildSchema(IPackage);

mongoose.model('Package', PackageSchema);

export type Package = IPackage & mongoose.Document;
