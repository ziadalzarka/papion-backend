import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageResolver } from './package.resolver';
import { PackageSchema } from './package.schema';
import { UserModule } from '@gray/user-module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Package', schema: PackageSchema }]),
  ],
  providers: [PackageService, PackageResolver],
})
export class PackageModule { }
