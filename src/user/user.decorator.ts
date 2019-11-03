import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((_, [__, ___, ctx]) => {
  return ctx.req.user;
});
