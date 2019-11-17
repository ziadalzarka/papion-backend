import { ObjectType, Field } from 'type-graphql';
import { PackagePriority } from './package.interface';
import { DatabaseEntity } from '@gray/graphql-essentials';

@ObjectType()
export class PackageEntity extends DatabaseEntity {
  @Field()
  name: string;
  @Field(type => PackagePriority)
  priority: PackagePriority;
  @Field()
  price: number;
  @Field()
  description: string;
}
