import { UseGuards, Logger } from '@nestjs/common';
import { Parent, Query, ResolveProperty, Resolver, Mutation, Args } from '@nestjs/graphql';
import { IUser } from 'app/user';
import { AuthGuard } from 'app/user/auth.guard';
import { ResolveUser } from 'app/user/resolve-user.decorator';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { User } from 'app/user/user.decorator';
import { BusinessUserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';
import { ObjectID } from 'bson';
import { PersonServiceEntity, UpdatePersonServiceInput } from './service.dto';
import { IService } from './service.schema';
import { ServiceService } from './service.service';
import { validate } from 'class-validator';
import { RequiredFieldsMissingException } from './exceptions/required-fields-missing.exception';
import { ProcessGraphQLUploadArgs } from '@gray/graphql-essentials';
import { ServiceNotOwnedException } from './exceptions/service-not-owned.exception';

@Resolver(of => PersonServiceEntity)
export class PersonResolverResolver {

  constructor(private serviceService: ServiceService, private userService: UserService) { }

  @Query(returns => PersonServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPersonBusiness])
  async personBusiness(@User() user: IUser) {
    return await this.serviceService.getPersonService(user._id);
  }

  @ResolveProperty('user', type => BusinessUserEntity)
  async user(@Parent() service: IService) {
    const doc = await this.userService._resolveUser(service.user as ObjectID);
    return new BusinessUserEntity(doc);
  }

  @Mutation(returns => PersonServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPersonBusiness])
  async publishPersonBusiness(@User() user: IUser) {
    const person = await this.serviceService.getPersonService(user._id);
    const validationErrors = await validate(person);
    const fields = validationErrors.map(error => error.property);
    if (fields.length > 0) {
      throw new RequiredFieldsMissingException(fields);
    } else {
      return await this.serviceService.updatePersonService(user._id, { published: true });
    }
  }

  @Mutation(returns => PersonServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPersonBusiness])
  async updatePersonBusiness(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => UpdatePersonServiceInput }) args: UpdatePersonServiceInput) {
    const payload = await ProcessGraphQLUploadArgs<UpdatePersonServiceInput>(args);
    return await this.serviceService.updatePersonService(user._id, payload);
  }

  @Mutation(returns => PersonServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPersonBusiness])
  async unpublishPersonBusiness(@User() user: IUser) {
    return await this.serviceService.updatePersonService(user._id, { published: false });
  }
}
