import { GraphQLException } from '@gray/graphql-essentials';

export class InvalidGalleryInputException extends GraphQLException {
  constructor() {
    super('You cannot both add and remove images from gallery at the time!', 'gallery/invalid-input');
  }
}
