import { ObjectID } from 'bson';
import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class DatabaseEntity<T = any> {
  @Field(type => ID)
  readonly _id: ObjectID;

  constructor(partial: Partial<T> | any) {
    if (partial.toJSON) {
      Object.assign(this, partial.toJSON());
    } else {
      Object.assign(this, partial);
    }
  }
}
