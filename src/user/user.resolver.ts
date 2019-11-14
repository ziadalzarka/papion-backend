import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { UserService } from './user.service';
import { Resolver, Mutation, Args, Info } from '@nestjs/graphql';
import { CreateClientUserInput, CreateBusinessUserInput, UserEntity, ClientUserEntity, BusinessUserEntity, UpdateUserProfileInput } from './user.dto';
import { UserType } from './user-type.dto';
import { ServiceService } from 'app/service/service.service';
import { ObjectID } from 'mongodb';
import { BusinessCategory } from './business-category.dto';
import { User } from './user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { IUser } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { ResolveUser } from './resolve-user.decorator';
import { OldPasswordDoesNotMatchException } from './exceptions/old-password-does-not-match.exception';

@Resolver('User')
export class UserResolver {

  constructor(private userService: UserService, private serviceService: ServiceService) { }

  @Mutation(returns => ClientUserEntity)
  async signUpClientUser(@Args({ type: () => CreateClientUserInput, name: 'payload' }) payload: CreateClientUserInput) {
    return await this.userService.createUser({ ...payload, userType: UserType.Client });
  }

  @Mutation(returns => BusinessUserEntity)
  async signUpBusinessUser(@Args({ type: () => CreateBusinessUserInput, name: 'payload' }) payload: CreateBusinessUserInput) {
    const doc = await this.userService.createUser({ ...payload, userType: UserType.Business });
    if (payload.businessCategory === BusinessCategory.Person) {
      await this.serviceService.updatePersonService(doc._id as any, {
        name: doc.name,
        address: doc.address,
        businessCategory: BusinessCategory.Person,
      });
    }
    return doc;
  }

  @Mutation(returns => UserEntity)
  @UseGuards(AuthGuard)
  @ResolveUser({ email: true, password: true })
  async updateProfile(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => UpdateUserProfileInput }) payload: UpdateUserProfileInput,
    @Info() info) {
    if (payload.email || payload.password) {
      if (!payload.oldPassword) {
        throw new OldPasswordDoesNotMatchException();
      }
      const valid = bcrypt.compareSync(payload.oldPassword, user.password);
      if (!valid) {
        throw new OldPasswordDoesNotMatchException();
      }
    }
    return await this.userService.updateUser(user._id, payload, graphqlMongodbProjection(info));
  }
}
