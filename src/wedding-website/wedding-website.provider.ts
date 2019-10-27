import { Connection } from 'mongoose';
import { WeddingWebsiteSchema } from './wedding-website.schema';

export const weddingWebsiteProviders = [
  {
    provide: 'WEDDING_WEBSITE_MODEL',
    useFactory: (connection: Connection) => connection.model('WeddingWebsite', WeddingWebsiteSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
