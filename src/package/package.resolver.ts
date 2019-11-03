import { Resolver, Query } from '@nestjs/graphql';
import { PackageEntity } from './package.dto';
import { AuthGuard } from 'app/user/auth.guard';
import { UseGuards } from '@nestjs/common';
import { PackageService } from './package.service';

@Resolver(of => PackageEntity)
export class PackageResolver {

  constructor(private packageService: PackageService) { }

  @Query(returns => [PackageEntity])
  @UseGuards(AuthGuard)
  packages() {
    return this.packageService.list();
  }

}
