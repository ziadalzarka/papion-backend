import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthPayload, LogInPayload } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { ResolveUser } from './resolve-user.decorator';
import { User } from './user.decorator';
import { UserEntity } from './user.dto';
import { UserService } from './user.service';

@Resolver('User')
export class AuthResolver {

  constructor(private userService: UserService) { }

  @Query(returns => UserEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  async me(@User() user) {
    return user;
  }

  @Query(returns => AuthPayload)
  async logIn(@Args({ name: 'payload', type: () => LogInPayload }) payload: LogInPayload) {
    return await this.userService.logInUser(payload.email, payload.password);
  }
}
