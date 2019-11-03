import { File, ProcessGraphQLUploadArgs } from '@gray/graphql-essentials';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
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
    private templateService: TemplateService) { }

  @Mutation(returns => WeddingWebsiteEntity)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.WeddingWebsites])
  @UseGuards(AuthGuard)
  async createWeddingWebsite(
    @User() user,
    @Args({ type: () => WeddingWebsiteInput, name: 'payload' }) args: WeddingWebsiteInput) {
    const payload = await ProcessGraphQLUploadArgs<WeddingWebsiteInput>(args);
    await this.templateService.validateTemplateUsable(payload.templateId);
    await this.weddingWebsiteService.validateWeddingWebsiteAvailable(payload.subdomain);
    await this.weddingWebsiteService.registerWeddingWebsite(payload.subdomain);
    return await this.weddingWebsiteService.createWeddingWebsite({
      ...payload,
      user: user._id,
      template: payload.templateId,
    });
  }

  @ResolveProperty('user', type => UserEntity)
  async user(@Parent() weddingWebsite: WeddingWebsite) {
    return await this.userService._resolveUser(weddingWebsite.user as ObjectID);
  }

  @ResolveProperty('template', type => TemplateEntity)
  async template(@Parent() weddingWebsite: WeddingWebsite) {
    return this.templateService._resolveTemplate(weddingWebsite.template as ObjectID);
  }

  @ResolveProperty('href', type => String)
  href(@Parent() weddingWebsite: WeddingWebsite) {
    return `http://${weddingWebsite.subdomain}.papion.love`;
  }

  @Query(returns => WeddingWebsiteEntity)
  async weddingWebsite(@Args({ name: 'subdomain', type: () => String }) subdomain: string) {
    const doc = await this.weddingWebsiteService.findBySubdomain(subdomain);
    if (!doc) {
      throw new WeddingWebsiteDoesNotExistException();
    }
    return doc;
  }

}
