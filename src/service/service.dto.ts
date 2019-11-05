import { DatabaseEntity, File } from '@gray/graphql-essentials';
import { PackagePriority } from 'app/package/package.interface';
import { Address, AddressInput, UpdateAddressInput } from 'app/user/address.dto';
import { BusinessCategory } from 'app/user/business-category.dto';
import { BusinessUserEntity } from 'app/user/user.dto';
import { IsNotEmpty } from 'class-validator';
import { ObjectID } from 'mongodb';
import { createUnionType, Field, InputType, ObjectType } from 'type-graphql';
import { PersonCategory, PlaceCategory } from './category.dto';
import { ResultsPage } from '@gray/graphql-essentials/page.dto';

// Validation decorators are here to validate the required fields internally
// before publishing but they are not used by NestJS ValidationPipe!
@ObjectType()
export class BaseServiceEntity extends DatabaseEntity {
  @IsNotEmpty()
  @Field()
  name: string;
  @Field(type => BusinessUserEntity)
  user: BusinessUserEntity;
  @Field(type => BusinessCategory)
  businessCategory: BusinessCategory;
  @IsNotEmpty()
  @Field()
  address: Address;
  @IsNotEmpty()
  @Field({ nullable: true })
  description?: string;
  @IsNotEmpty()
  @Field({ nullable: true })
  startingPrice?: number;
  @Field()
  rating: number;
  @Field()
  acceptsMultiple: boolean;
  @Field()
  published: boolean;
  @Field(type => PackagePriority)
  packagePriority: PackagePriority;
}

@ObjectType()
export class PlaceServiceEntity extends BaseServiceEntity {
  @IsNotEmpty()
  @Field({ nullable: true })
  coverImage?: string;
  @IsNotEmpty()
  @Field(type => PlaceCategory, { nullable: true })
  category?: PlaceCategory;
}

@ObjectType()
export class PersonServiceEntity extends BaseServiceEntity {
  @IsNotEmpty()
  @Field({ nullable: true })
  image?: string;
  @IsNotEmpty()
  @Field(type => PersonCategory, { nullable: true })
  category?: PersonCategory;
}

export const ServiceEntity = createUnionType({
  name: 'ServiceEntity',
  types: [PersonServiceEntity, PlaceServiceEntity],
  resolveType: entity => {
    switch (entity.businessCategory) {
      case BusinessCategory.Place:
        return 'PlaceServiceEntity';
      case BusinessCategory.Person:
        return 'PersonServiceEntity';
    }
  },
});

@InputType()
export class CreatePlaceServiceInput {
  @Field()
  name: string;
  @Field(type => AddressInput)
  address: AddressInput;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  acceptsMultiple?: boolean;
  @Field({ nullable: true })
  startingPrice?: number;
  @Field(type => File, { nullable: true })
  coverImage?: string;
  @Field(type => PlaceCategory, { nullable: true })
  category?: PlaceCategory;
}

@InputType()
export class UpdatePlaceServiceInput {
  @Field({ nullable: true })
  name?: string;
  @Field(type => AddressInput, { nullable: true })
  address?: UpdateAddressInput;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  acceptsMultiple?: boolean;
  @Field({ nullable: true })
  startingPrice?: number;
  @Field({ nullable: true })
  rating?: number;
  @Field(type => File, { nullable: true })
  coverImage?: string;
  @Field(type => PlaceCategory, { nullable: true })
  category?: PlaceCategory;
}

@InputType()
export class UpdatePlaceServicePayloadInput {
  @Field()
  id: ObjectID;
  @Field()
  data: UpdatePlaceServiceInput;
}

@InputType()
export class UpdatePersonServiceInput {
  @Field({ nullable: true })
  name?: string;
  @Field(type => UpdateAddressInput, { nullable: true })
  address?: UpdateAddressInput;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  acceptsMultiple?: boolean;
  @Field({ nullable: true })
  startingPrice?: number;
  @Field(type => File, { nullable: true })
  image?: string;
  @Field(type => PersonCategory, { nullable: true })
  category?: PersonCategory;
}