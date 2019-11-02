import { TemplateSchema } from './template.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateService } from './template.service';
import { TemplateResolver } from './template.resolver';
import { UserModule } from '@gray/user-module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }]),
  ],
  providers: [TemplateService, TemplateResolver],
  exports: [TemplateService],
})
export class TemplateModule { }
