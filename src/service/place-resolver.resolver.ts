import { Logger, UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveProperty, Resolver, Mutation, Info } from '@nestjs/graphql';
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
import { ProcessGraphQLUploadArgs, graphqlMongodbProjection } from '@gray/graphql-essentials';
import { ServiceNotOwnedException } from './exceptions/service-not-owned.exception';
import { GraphQLResolveInfo } from 'graphql';
import { galleryInputToMongoDB } from './service.util';

@Resolver(of => PlaceServiceEntity)
export class PlaceResolverResolver {
  constructor(private serviceService: ServiceService, private userService: UserService) { }

  @Query(returns => [PlaceServiceEntity])
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async placeBusinesses(@User() user: IUser, @Info() info: GraphQLResolveInfo) {
    return this.serviceService.listPlaceServices(user._id, graphqlMongodbProjection(info));
  }

  @Query(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async placeBusiness(@Args({ name: 'id', type: () => ObjectID }) id: ObjectID, @Info() info: GraphQLResolveInfo) {
    return await this.serviceService._resolvePlaceService(id, graphqlMongodbProjection(info));
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async publishPlaceBusiness(@User() user: IUser, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID, @Info() info: GraphQLResolveInfo) {
    const place = await this.serviceService._resolvePlaceService(id);
    if (!user._id.equals(place.owner as any)) {
      throw new ServiceNotOwnedException();
    }
    const validationErrors = await validate(place);
    const fields = validationErrors.map(error => error.property);
    if (fields.length > 0) {
      throw new RequiredFieldsMissingException(fields);
    } else {
      return await this.serviceService.updatePlaceService(id, { published: true }, graphqlMongodbProjection(info));
    }
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async createPlaceBusiness(@User() user: IUser, @Args({ name: 'payload', type: () => CreatePlaceServiceInput }) args: CreatePlaceServiceInput) {
    const payload = await ProcessGraphQLUploadArgs<CreatePlaceServiceInput>(args);
    return await this.serviceService.createPlaceService({ ...payload, owner: user._id });
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async updatePlaceBusiness(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => UpdatePlaceServicePayloadInput }) args: UpdatePlaceServicePayloadInput,
    @Info() info: GraphQLResolveInfo) {
    const { id, data: { gallery, ...payload } } = await ProcessGraphQLUploadArgs<UpdatePlaceServicePayloadInput>(args);
    await this.serviceService.validateServiceOwned(id, user._id);
    return await this.serviceService.updatePlaceService(id, {
      ...payload,
      ...galleryInputToMongoDB(gallery),
    }, graphqlMongodbProjection(info));
  }

  @ResolveProperty('owner', type => BusinessUserEntity)
  async owner(@Parent() service: IService, @Info() info: GraphQLResolveInfo) {
    const doc = await this.userService._resolveUser(service.owner as ObjectID, graphqlMongodbProjection(info));
    return new BusinessUserEntity(doc);
  }

  @Mutation(returns => PlaceServiceEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.RegisterPlaceBusiness])
  async unpublishPlaceBusiness(@User() user: IUser, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID, @Info() info: GraphQLResolveInfo) {
    await this.serviceService.validateServiceOwned(id, user._id);
    return await this.serviceService.updatePlaceService(id, { published: false }, graphqlMongodbProjection(info));
  }

}
