import { UserService } from './user.service';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateClientUserInput, CreateBusinessUserInput, UserEntity, ClientUserEntity, BusinessUserEntity } from './user.dto';
import { UserType } from './user-type.dto';

@Resolver('User')
export class UserResolver {

  constructor(private userService: UserService) { }

  @Mutation(returns => UserEntity)
  async signUpClientUser(@Args({ type: () => CreateClientUserInput, name: 'payload' }) payload: CreateClientUserInput) {
    return await this.userService.createUser({ ...payload, userType: UserType.Client });
  }

  @Mutation(returns => UserEntity)
  async signUpBusinessUser(@Args({ type: () => CreateBusinessUserInput, name: 'payload' }) payload: CreateBusinessUserInput) {
    return await this.userService.createUser({ ...payload, userType: UserType.Business });
  }
}
