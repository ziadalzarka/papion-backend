import * as path from 'path';
import * as Handlebars from 'handlebars';
import { HandlebarsAdapter } from 'nest-mailer';
import { ConfigUtils } from 'app/config/config.util';
import { Logger } from '@nestjs/common';

function generateConfiguration() {
  const { daemon, sender, host, user, pass, templates } = ConfigUtils.email;

  const transport = `smtps://${user}:${pass}@${host}`;

  const from = `"${daemon}" <${sender}>`;

  const dir = path.join(__dirname, templates);

  return { transport, from, dir };
}

export function emailFactory() {
  const { transport, from, dir } = generateConfiguration();
  return {
    transport,
    defaults: { from },
    template: {
      dir,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
