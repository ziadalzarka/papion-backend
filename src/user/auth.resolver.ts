import { UserService } from './user.service';
import { ObjectID } from 'bson';
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UserEntity, ClientUserEntity, BusinessUserEntity } from 'app/user/user.dto';
import { AuthPayload, LogInPayload } from 'app/user/auth.dto';
import { UseGuards, ClassSerializerInterceptor, UseInterceptors, SerializeOptions } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UserType } from './user-type.dto';

@Resolver('User')
export class AuthResolver {

  constructor(private userService: UserService) { }

  @Query(returns => UserEntity)
  @UseGuards(AuthGuard)
  async me(@Context() { req, res }) {
    console.log('hello');
    return new ClientUserEntity({ _id: new ObjectID(), name: 'hello', email: 'zizohotot@gmail.com', userType: UserType.Client });
  }

  @Query(returns => AuthPayload)
  async logIn(@Args({ name: 'payload', type: () => LogInPayload }) payload: LogInPayload) {
    return await this.userService.logInUser(payload.email, payload.password);
  }
}
