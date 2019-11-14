import { SetMetadata } from '@nestjs/common';

export const ResolveUser = (population = {}) => SetMetadata('resolve_user', population);
