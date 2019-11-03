import { GraphQLException } from '@gray/graphql-essentials';

export class RequiredFieldsMissingException extends GraphQLException {
  constructor(fields: string[]) {
    super('Required fields constraints are not fulfilled!', 'business-service/publish-constraints', { fields });
  }
}
