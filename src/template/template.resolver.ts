import { graphqlMongodbProjection } from '@gray/graphql-essentials';
import { Resolver, Query, Info } from '@nestjs/graphql';
import { TemplateService } from './template.service';
import { TemplateEntity } from './template.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'app/user/auth.guard';

@Resolver('Template')
export class TemplateResolver {
  constructor(private templateService: TemplateService) { }

  @Query(returns => [TemplateEntity])
  @UseGuards(AuthGuard)
  templates(@Info() info) {
    return this.templateService.list(graphqlMongodbProjection(info));
  }
}
