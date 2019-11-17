import { InputType, Field } from 'type-graphql';
import { ObjectID } from 'bson';
import { PackagePriority } from 'app/package/package.interface';

@InputType()
export class CreatePackageInput {
  @Field()
  name: string;
  @Field(type => PackagePriority)
  priority: PackagePriority;
  @Field()
  price: number;
  @Field()
  description: string;
}

@InputType()
export class UpdatePackageInput {
  @Field({ nullable: true })
  name?: string;
  @Field(type => PackagePriority, { nullable: true })
  priority?: PackagePriority;
  @Field({ nullable: true })
  price?: number;
  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdatePackagePayloadInput {
  @Field(type => ObjectID)
  id: ObjectID;
  @Field(type => UpdatePackageInput)
  data: UpdatePackageInput;
}
