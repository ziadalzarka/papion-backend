import { UpdateGalleryInput } from './service.dto';
import { InvalidGalleryInputException } from './exceptions/invalid-gallery-input.exception';

export function galleryInputToMongoDB(input: UpdateGalleryInput) {
  if (input.add && input.remove) {
    throw new InvalidGalleryInputException();
  }
  return {
    ...input.add && {
      $push: {
        gallery: input.add,
      },
    },
    ...input.remove && {
      $pull: {
        gallery: { $in: input.remove },
      },
    },
  };
}
