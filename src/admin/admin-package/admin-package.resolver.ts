import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { AdminPackageService } from './admin-package.service';
import { Resolver, Mutation, Args, Info } from '@nestjs/graphql';
import { PackageEntity } from 'app/package/package.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'app/user/auth.guard';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { UpdatePackagePayloadInput, CreatePackageInput } from './admin-package.dto';
import { ObjectID } from 'mongodb';

@Resolver(of => PackageEntity)
export class AdminPackageResolver {

  constructor(private adminPackageService: AdminPackageService) { }

  @Mutation(type => PackageEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.AdminPackages])
  async createPackage(@Args({ name: 'payload', type: () => CreatePackageInput }) payload: CreatePackageInput) {
    return await this.adminPackageService.createPackage(payload);
  }

  @Mutation(type => PackageEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.AdminPackages])
  async updatePackage(
    @Info() info,
    @Args({ name: 'payload', type: () => UpdatePackagePayloadInput }) payload: UpdatePackagePayloadInput) {
    return await this.adminPackageService.updatePackage(payload.id, payload.data, graphqlMongodbProjection(info));
  }

  @Mutation(type => PackageEntity)
  @UseGuards(AuthGuard)
  @AuthScopes([AuthenticationScope.AdminPackages])
  async deletePackage(
    @Info() info,
    @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    return await this.adminPackageService.deletePackage(id, graphqlMongodbProjection(info));
  }

}
