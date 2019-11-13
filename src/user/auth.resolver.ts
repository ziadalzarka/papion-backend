import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Info } from '@nestjs/graphql';
import { AuthPayload, LogInPayload } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { ResolveUser } from './resolve-user.decorator';
import { User } from './user.decorator';
import { UserEntity } from './user.dto';
import { UserService } from './user.service';
import { ResetPasswordUserSummary, ResetPasswordInput } from './reset.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserResetCodeExpiredException } from './exceptions/user-reset-code-expired.exception';

@Resolver()
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

  @Mutation(returns => ResetPasswordUserSummary)
  async generatePasswordResetCode(@Args({ name: 'email', type: () => String }) email: string, @Info() info) {
    return await this.userService.generatePasswordResetCode({ email }, graphqlMongodbProjection(info));
  }

  @Query(returns => ResetPasswordUserSummary)
  async passwordResetCodeSummary(@Args({ name: 'code', type: () => String }) code: string, @Info() info) {
    return await this.userService.validatePasswordResetCode(code, graphqlMongodbProjection(info));
  }

  @Mutation(returns => ResetPasswordUserSummary)
  async resetPassword(@Args({ name: 'payload', type: () => ResetPasswordInput }) payload: ResetPasswordInput, @Info() info) {
    const doc = await this.userService.validatePasswordResetCode(payload.code, graphqlMongodbProjection(info));
    await this.userService.resetUserPassword(doc._id, payload.password);
    return doc;
  }
}
