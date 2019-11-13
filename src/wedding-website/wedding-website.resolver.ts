import { WeddingWebsiteNotOwnedException } from './exceptions/wedding-website-not-owned.exception';
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
import { WeddingWebsiteEntity, WeddingWebsiteInput, UpdateWeddingWebsiteInput, UpdateWeddingWebsitePayloadInput } from './wedding-website.dto';
import { WeddingWebsite } from './wedding-website.schema';
import { WeddingWebsiteService } from './wedding-website.service';
import { IUser } from 'app/user';
import { PlaceServiceEntity } from 'app/service/service.dto';
import { ServiceService } from 'app/service/service.service';
import { NotificationService } from 'app/notification/notification.service';
import { NotificationType } from 'app/notification/notification-type.dto';
import { GraphQLResolveInfo } from 'graphql';
import { AuthOptional } from 'app/user/auth-optional.decorator';

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
    private serviceService: ServiceService,
    private notificationService: NotificationService) { }

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
    const doc = await this.weddingWebsiteService.createWeddingWebsite({
      ...payload,
      user: user._id,
      template: payload.templateId,
      venue: venueId,
    });
    await this.notificationService.createNotification({
      user: user._id,
      dataRef: doc._id,
      notificationType: NotificationType.WeddingWebsiteCreated,
    });
    return doc;
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

  @Query(returns => WeddingWebsiteEntity, { nullable: true })
  @UseGuards(AuthGuard)
  @AuthOptional()
  async weddingWebsite(
    @Args({
      name: 'subdomain',
      type: () => String,
      nullable: true,
      description: 'Leave empty to get the current user wedding website',
    }) subdomain: string,
    @Info() info: GraphQLResolveInfo,
    @User() user: IUser,
  ) {
    if (!subdomain && !user) { return null; }
    const doc = await this.weddingWebsiteService.findOne({
      ...subdomain ? { subdomain } : { user: user._id },
    }, graphqlMongodbProjection(info));
    if (!doc) {
      throw new WeddingWebsiteDoesNotExistException();
    }
    return doc;
  }

  @Mutation(returns => WeddingWebsiteEntity)
  @UseGuards(AuthGuard)
  async updateWeddingWebsite(
    @User() user: IUser,
    @Args({ name: 'payload', type: () => UpdateWeddingWebsitePayloadInput }) payload: UpdateWeddingWebsitePayloadInput,
    @Info() info) {
    await this.weddingWebsiteService.validateWeddingWebsiteOwned(payload.id, user._id);
    if (payload.data.templateId) { await this.templateService.validateTemplateUsable(payload.data.templateId); }
    return await this.weddingWebsiteService.updateWeddingWebsite(payload.id, {
      ...payload.data,
      ...payload.data.templateId && { template: payload.data.templateId },
    }, graphqlMongodbProjection(info));
  }

  @Mutation(returns => WeddingWebsiteEntity)
  @UseGuards(AuthGuard)
  async deleteWeddingWebsite(@User() user: IUser, @Args({ name: 'id', type: () => ObjectID }) id: ObjectID) {
    await this.weddingWebsiteService.validateWeddingWebsiteOwned(id, user._id);
    return await this.weddingWebsiteService.deleteWeddingWebsite(id);
  }

}
