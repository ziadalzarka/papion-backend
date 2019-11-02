import { GraphQLException } from '@gray/graphql-essentials';

export class TemplateDoesNotExistException extends GraphQLException {
  constructor() {
    super('Wedding website template does not exists!', 'wedding-website-template/does-not-exist');
  }
}
