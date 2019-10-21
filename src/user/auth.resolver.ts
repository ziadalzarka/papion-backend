import { UserService } from './user.service';
import { ObjectID } from 'bson';
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UserEntity, ClientUserEntity, BusinessUserEntity, UnionUserEntity } from 'app/user/user.dto';
import { AuthPayload, LogInPayload } from 'app/user/auth.dto';
import { UseGuards, ClassSerializerInterceptor, UseInterceptors, SerializeOptions, Logger } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UserType } from './user-type.dto';
import { ResolveUser } from './resolve-user.decorator';

@Resolver('User')
export class AuthResolver {

  constructor(private userService: UserService) { }

  @Query(returns => UserEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  async me(@Context() { req, res }) {
    return UnionUserEntity(req.user);
  }

  @Query(returns => AuthPayload)
  async logIn(@Args({ name: 'payload', type: () => LogInPayload }) payload: LogInPayload) {
    return await this.userService.logInUser(payload.email, payload.password);
  }
}
