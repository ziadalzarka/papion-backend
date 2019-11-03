import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthTokenService } from './auth-token.service';
import { UserSchema } from '.';
import { ServiceModule } from 'app/service/service.module';

@Module({
  imports: [
    ServiceModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    AuthResolver,
    UserService,
    UserResolver,
    AuthTokenService,
  ],
  exports: [AuthTokenService, UserService],
})
export class UserModule { }
