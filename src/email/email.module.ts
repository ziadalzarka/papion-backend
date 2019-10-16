import { Module } from '@nestjs/common';
import { MailerModule } from 'nest-mailer';
import { emailFactory } from './email.factory';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: emailFactory,
    }),
  ],
})
export class EmailModule { }
