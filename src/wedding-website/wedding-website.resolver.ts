import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { File, ProcessGraphQLUploadArgs } from '@gray/graphql-essentials';
import { UseGuards, Logger } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Info } from '@nestjs/graphql';
import { TemplateEntity } from 'app/template/template.dto';
import { TemplateService } from 'app/template/template.service';
import { AuthGuard } from 'app/user/auth.guard';
import { ResolveUser } from 'app/user/resolve-user.decorator';
import { AuthScopes } from 'app/user/scope.decorator';
import { AuthenticationScope } from 'app/user/token.interface';
import { User } from 'app/user/user.decorator';
import { UserEntity } from 'app/user/user.dto';
import { UserService } from 'app/user/user.service';
import { ObjectID } from 'mongodb';
import { Field, InputType } from 'type-graphql';
import { WeddingWebsiteDoesNotExistException } from './exceptions/wedding-website-does-not-exist.exception';
import { WeddingWebsiteEntity, WeddingWebsiteInput } from './wedding-website.dto';
import { WeddingWebsite } from './wedding-website.schema';
import { WeddingWebsiteService } from './wedding-website.service';
import { IUser } from 'app/user';
import { PlaceServiceEntity } from 'app/service/service.dto';
import { ServiceService } from 'app/service/service.service';

@InputType()
class FileUploadInput {
  @Field(type => File)
  file: string;
}

@Resolver(of => WeddingWebsiteEntity)
export class WeddingWebsiteResolver {

  constructor(
    private weddingWebsiteService: WeddingWebsiteService,
    private userService: UserService,
    private templateService: TemplateService,
    private serviceService: ServiceService) { }

  @Mutation(returns => WeddingWebsiteEntity)
  @AuthScopes([AuthenticationScope.WeddingWebsites])
  @UseGuards(AuthGuard)
  async createWeddingWebsite(
    @User() user: IUser,
    @Args({ type: () => WeddingWebsiteInput, name: 'payload' }) args: WeddingWebsiteInput) {
    const payload = await ProcessGraphQLUploadArgs<WeddingWebsiteInput>(args);
    await this.weddingWebsiteService.validateWeddingWebsiteQuotaAvailable(user._id);
    const venueId = await this.weddingWebsiteService.validateReservation(payload.reservationId, user._id) as any;
    await this.templateService.validateTemplateUsable(payload.templateId);
    await this.weddingWebsiteService.validateWeddingWebsiteAvailable(payload.subdomain);
    await this.weddingWebsiteService.registerWeddingWebsite(payload.subdomain);
    return await this.weddingWebsiteService.createWeddingWebsite({
      ...payload,
      user: user._id,
      template: payload.templateId,
      venue: venueId,
    });
  }

  @ResolveProperty('user', type => UserEntity)
  async user(@Parent() weddingWebsite: WeddingWebsite, @Info() info) {
    return await this.userService._resolveUser(weddingWebsite.user as ObjectID, graphqlMongodbProjection(info));
  }

  @ResolveProperty('template', type => TemplateEntity)
  async template(@Parent() weddingWebsite: WeddingWebsite, @Info() info) {
    return this.templateService._resolveTemplate(weddingWebsite.template as ObjectID, graphqlMongodbProjection(info));
  }

  @ResolveProperty('venue', type => PlaceServiceEntity)
  async venue(@Parent() weddingWebsite: WeddingWebsite, @Info() info) {
    return await this.serviceService._resolvePlaceService(weddingWebsite.venue as ObjectID, graphqlMongodbProjection(info));
  }

  @ResolveProperty('href', type => String)
  href(@Parent() weddingWebsite: WeddingWebsite) {
    return `http://${weddingWebsite.subdomain}.papion.love`;
  }

  @Query(returns => WeddingWebsiteEntity)
  async weddingWebsite(@Args({ name: 'subdomain', type: () => String }) subdomain: string, @Info() info) {
    const doc = await this.weddingWebsiteService.findBySubdomain(subdomain, graphqlMongodbProjection(info));
    if (!doc) {
      throw new WeddingWebsiteDoesNotExistException();
    }
    return doc;
  }

}
