import { GraphQLException } from '@gray/graphql-essentials';

export class TemplateDoesNotExistException extends GraphQLException {
  constructor() {
    super('Wedding website template does not exists!', 'wedding-template/does-not-exist');
  }
}
