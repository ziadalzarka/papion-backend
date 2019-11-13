import { EmailConfiguration } from './email.interface';
import { Module, DynamicModule } from '@nestjs/common';
import { MailerModule } from 'nest-mailer';
import { emailFactory } from './email.factory';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService]
})
export class EmailModule {
  static forRoot(config: EmailConfiguration): DynamicModule {
    return {
      module: EmailModule,
      imports: [
        MailerModule.forRootAsync({
          useFactory: emailFactory(config),
        }),
      ],
      providers: [
        {
          provide: 'EMAIL_CONFIG',
          useValue: config,
        },
      ],
      exports: [EmailService],
    };
  }
}
