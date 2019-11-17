import { Module } from '@nestjs/common';
import { AdminPackageModule } from './admin-package/admin-package.module';
import { AdminCmsModule } from './admin-cms/admin-cms.module';
import { AdminTemplateModule } from './admin-template/admin-template.module';

@Module({
  imports: [AdminPackageModule, AdminCmsModule, AdminTemplateModule]
})
export class AdminModule {}
