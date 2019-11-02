import { ObjectID } from 'mongodb';
import { ProcessGraphQLUploadArgs } from './../../libs/graphql-essentials/src/nest-await';
import { WeddingWebsite } from './wedding-website.schema';
import { WeddingWebsiteService } from './wedding-website.service';
import { Resolver, Mutation, Args, ResolveProperty, Parent, Info } from '@nestjs/graphql';
import { WeddingWebsiteInput, WeddingWebsiteEntity } from './wedding-website.dto';
import { UseGuards, UseInterceptors, Logger } from '@nestjs/common';
import { ResolveUser } from '@gray/user-module/resolve-user.decorator';
import { AuthGuard } from '@gray/user-module/auth.guard';
import { User } from '@gray/user-module/user.decorator';
import { AuthenticationScope } from '@gray/user-module/token.interface';
import { AuthScopes } from '@gray/user-module/scope.decorator';
import { File } from '@gray/graphql-essentials';
import { InputType, Field } from 'type-graphql';
import { UserService } from '@gray/user-module/user.service';
import { UserEntity, UnionUserEntity } from '@gray/user-module/user.dto';
import { GraphQLResolveInfo } from 'graphql';
import { TemplateService } from 'app/template/template.service';
import { TemplateEntity } from 'app/template/template.dto';

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
    @Args({ type: () => WeddingWebsiteInput, name: 'payload' }) args: WeddingWebsiteInput, @Info() info: GraphQLResolveInfo) {
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
    const doc = await this.userService._resolveUser(weddingWebsite.user as ObjectID);
    return UnionUserEntity(doc);
  }

  @ResolveProperty('template', type => TemplateEntity)
  async template(@Parent() weddingWebsite: WeddingWebsite) {
    return this.templateService._resolveTemplate(weddingWebsite.template as ObjectID);
  }

  @ResolveProperty('href', type => String)
  href(@Parent() weddingWebsite: WeddingWebsite) {
    return `${weddingWebsite.subdomain}.papion.love`;
  }

}
