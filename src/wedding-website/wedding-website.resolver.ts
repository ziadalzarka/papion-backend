import { WeddingWebsite } from './wedding-website.schema';
import { WeddingWebsiteService } from './wedding-website.service';
import { Resolver, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { WeddingWebsiteInput, WeddingWebsiteEntity } from './wedding-website.dto';
import { Query, UseGuards, Logger } from '@nestjs/common';
import { ResolveUser } from '@gray/user-module/resolve-user.decorator';
import { AuthGuard } from '@gray/user-module/auth.guard';
import { User } from '@gray/user-module/user.decorator';
import { AuthenticationScope } from '@gray/user-module/token.interface';
import { AuthScopes } from '@gray/user-module/scope.decorator';

@Resolver(of => WeddingWebsiteEntity)
export class WeddingWebsiteResolver {

  constructor(private weddingWebsiteService: WeddingWebsiteService) { }

  @Mutation(returns => WeddingWebsiteEntity)
  @ResolveUser()
  @AuthScopes([AuthenticationScope.WeddingWebsites])
  @UseGuards(AuthGuard)
  async createWeddingWebsite(
    @User() user,
    @Args({ type: () => WeddingWebsiteInput, name: 'payload' }) payload: WeddingWebsiteInput) {
    await this.weddingWebsiteService.validateWeddingWebsiteAvailable(payload.subdomain);
    await this.weddingWebsiteService.registerWeddingWebsite(payload.subdomain);
    const doc = await this.weddingWebsiteService.createWeddingWebsite({ ...payload, user: user._id });
    const populated = await doc.populate('user').execPopulate();
    return populated.toJSON();
  }

  @ResolveProperty('href', () => String)
  href(@Parent() weddingWebsite: WeddingWebsite) {
    return `${weddingWebsite.subdomain}.papion.love`;
  }

}
