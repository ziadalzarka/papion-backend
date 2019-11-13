import * as Handlebars from 'handlebars';
import { HandlebarsAdapter } from 'nest-mailer';
import * as path from 'path';
import { EmailConfiguration } from './email.interface';

export function emailFactory(config: EmailConfiguration) {
  return () => {
    return {
      transport: `smtps://${config.username}:${config.password}@${config.host}`,
      defaults: {
        from: `"${config.daemonName}" <${config.senderEmail}>`,
        context: config.context,
      },
      template: {
        dir: path.join(process.cwd(), config.templatesDirectory),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  };
}
