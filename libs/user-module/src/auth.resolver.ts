import { UserService } from './user.service';
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UserEntity, UnionUserEntity } from './user.dto';
import { AuthPayload, LogInPayload } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ResolveUser } from './resolve-user.decorator';
import { User } from './user.decorator';

@Resolver('User')
export class AuthResolver {

  constructor(private userService: UserService) { }

  @Query(returns => UserEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  async me(@User() user) {
    return UnionUserEntity(user);
  }

  @Query(returns => AuthPayload)
  async logIn(@Args({ name: 'payload', type: () => LogInPayload }) payload: LogInPayload) {
    return await this.userService.logInUser(payload.email, payload.password);
  }
}
