import { Module } from '@nestjs/common';
import { AuthResolver } from 'app/user/auth.resolver';
import { UserService } from './user.service';
import { userProviders } from './user.provider';
import { MongooseDatabaseModule } from '@gray/mongoose-database';
import { UserResolver } from './user.resolver';
import { AuthTokenService } from './auth-token.service';

@Module({
  imports: [MongooseDatabaseModule],
  providers: [
    AuthResolver,
    UserService,
    ...userProviders,
    UserResolver,
    AuthTokenService,
  ],
})
export class UserModule { }
