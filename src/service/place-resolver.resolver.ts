import { Logger, UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveProperty, Resolver, Mutation } from '@nestjs/graphql';
import { IUser } from 'app/user';
import { AuthGuard } from 'app/user/auth.guard';
import { ResolveUser } from 'app/user/resolve-user.decorator';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { User } from 'app/user/user.decorator';
import { BusinessUserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';
import { validate } from 'class-validator';
import { ObjectID } from 'mongodb';
import { PlaceServiceEntity, UpdatePlaceServiceInput, UpdatePlaceServicePayloadInput, CreatePlaceServiceInput } from './service.dto';
import { IService } from './service.schema';
import { ServiceService } from './service.service';
import { RequiredFieldsMissingException } from './exceptions/required-fields-missing.exception';
import { ProcessGraphQLUploadArgs } from '@gray/graphql-essentials';
import { ServiceNotOwnedException } from './exceptions/service-not-owned.exception';

@Resolver(of => PlaceServiceEntity)
export class PlaceResolverResolver {
  constructor(private serviceService: ServiceService, private userService: UserService) { }

  @Query(returns => [PlaceServiceEntity])
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinesses(@User() user: IUser) {
    return this.serviceService.listPlaceServices(user._id);
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async publishPlaceBusiness(@User() user: IUser, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    const place = await this.serviceService._resolvePlaceService(id);
    if (!user._id.equals(place.user as any)) {
      throw new ServiceNotOwnedException();
    }
    const validationErrors = await validate(place);
    const fields = validationErrors.map(error => error.property);
    if (fields.length > 0) {
      throw new RequiredFieldsMissingException(fields);
    } else {
      return await this.serviceService.updatePlaceService(id, { published: true });
    }
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async createPlaceBusiness(@User() user: IUser, @Args({ name: 'payload', type: () => CreatePlaceServiceInput }) args: CreatePlaceServiceInput) {
    const payload = await ProcessGraphQLUploadArgs<CreatePlaceServiceInput>(args);
    return await this.serviceService.createPlaceService({ ...payload, user: user._id });
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async updatePlaceBusiness(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => UpdatePlaceServicePayloadInput }) args: UpdatePlaceServicePayloadInput) {
    const payload = await ProcessGraphQLUploadArgs<UpdatePlaceServicePayloadInput>(args);
    const entity = await this.serviceService._resolvePlaceService(payload.id);
    if (!user._id.equals(entity.user as any)) {
      throw new ServiceNotOwnedException();
    }
    return await this.serviceService.updatePlaceService(payload.id, payload.data);
  }

  @ResolveProperty('user', type => BusinessUserEntity)
  async user(@Parent() service: IService) {
    const doc = await this.userService._resolveUser(service.user as ObjectID);
    return new BusinessUserEntity(doc);
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async unpublishPlaceBusiness(@User() user: IUser, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    const place = await this.serviceService._resolvePlaceService(id);
    if (!user._id.equals(place.user as any)) {
      throw new ServiceNotOwnedException();
    }
    return await this.serviceService.updatePlaceService(id, { published: false });
  }

}
