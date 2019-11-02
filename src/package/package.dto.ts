import { ObjectType, Field } from 'type-graphql';
import { PackagePriority } from './package.interface';

@ObjectType()
export class PackageEntity {
  @Field()
  name: string;
  @Field(type => PackagePriority)
  priority: PackagePriority;
  @Field()
  price: number;
  @Field()
  description: string;
}
