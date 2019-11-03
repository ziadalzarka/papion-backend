import { SetMetadata } from '@nestjs/common';
import { AuthenticationScope } from './token.interface';

export const AuthScopes = (scopes: AuthenticationScope[]) => SetMetadata('scopes', scopes);
