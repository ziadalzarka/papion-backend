import { Module } from '@nestjs/common';
import { AuthResolver } from 'app/user/auth.resolver';
import { UserService } from './user.service';
import { userProviders } from './user.provider';
import { DatabaseModule } from 'app/database/database.module';
import { UserResolver } from './user.resolver';
import { AuthTokenService } from './auth-token.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthResolver,
    UserService,
    ...userProviders,
    UserResolver,
    AuthTokenService,
  ],
})
export class UserModule { }
