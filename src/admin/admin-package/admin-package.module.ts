import { Module } from '@nestjs/common';
import { AdminPackageResolver } from './admin-package.resolver';
import { AdminPackageService } from './admin-package.service';
import { PackageModule } from 'app/package/package.module';
import { UserModule } from 'app/user';

@Module({
  imports: [PackageModule, UserModule],
  providers: [AdminPackageResolver, AdminPackageService],
})
export class AdminPackageModule { }
