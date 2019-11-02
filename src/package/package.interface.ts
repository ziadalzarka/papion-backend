import { registerEnumType } from 'type-graphql';

export enum PackagePriority {
  Gold = 'gold',
  Silver = 'silver',
  Bronze = 'bronze',
}

registerEnumType(PackagePriority, { name: 'PackagePriority' });
