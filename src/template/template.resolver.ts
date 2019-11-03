import { Resolver, Query } from '@nestjs/graphql';
import { TemplateService } from './template.service';
import { TemplateEntity } from './template.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'app/user/auth.guard';

@Resolver('Template')
export class TemplateResolver {
  constructor(private templateService: TemplateService) { }

  @Query(returns => [TemplateEntity])
  @UseGuards(AuthGuard)
  templates() {
    return this.templateService.list();
  }
}
