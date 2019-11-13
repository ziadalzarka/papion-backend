import { Injectable, Inject } from '@nestjs/common';
import { MailerService, ISendMailOptions } from 'nest-mailer';
import { EmailConfiguration } from './email.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {

  style: string;

  constructor(
    @Inject('EMAIL_CONFIG') private config: EmailConfiguration,
    private mailerService: MailerService,
  ) {
    this.onInit();
  }

  onInit() {
    this.style = fs.readFileSync(path.join(process.cwd(), `${this.config.templatesDirectory}/style.css`)).toString();
  }

  sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail({
      ...options,
      context: {
        ...this.config.context,
        style: this.style,
        ...options.context,
      },
    });
  }
}
