import { registerEnumType } from 'type-graphql';

export enum PackagePriority {
  Gold = 'gold',
  Silver = 'silver',
  Free = 'free',
}

registerEnumType(PackagePriority, { name: 'PackagePriority' });
