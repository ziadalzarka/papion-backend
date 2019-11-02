import { DatabaseEntity } from '@gray/graphql-essentials';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class TemplateEntity extends DatabaseEntity<TemplateEntity> {
  @Field()
  name: string;
  @Field()
  preview_url: string;
  @Field()
  stylesheet_url: string;
}
