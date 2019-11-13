import { SetMetadata } from '@nestjs/common';

export const AuthOptional = () => SetMetadata('auth_optional', true);
