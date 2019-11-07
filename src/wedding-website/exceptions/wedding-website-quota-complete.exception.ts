import { ConfigUtils } from 'app/config/config.util';
import { GraphQLException } from '@gray/graphql-essentials';

export class WeddingWebsiteQuotaCompleteException extends GraphQLException {
  constructor() {
    // TODO: remove the LOL please
    if (ConfigUtils.metadata.production) {
      super('You have used all of your quota of wedding websites!', 'wedding-websites/all-quota-used');
    } else {
      super('You have used all your quota of wedding websites, bitch! Which is just one btw LOL :"D. \
      If you see this please remind me to remove the LOLs I put in the code, but don\'t yell because I\'m sensitive and \
      I might die LOL', 'fuck-you/lol');
    }
  }
}
