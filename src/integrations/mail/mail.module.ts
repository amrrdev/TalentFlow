import { Module } from '@nestjs/common';
import mailConfig from './config/mail.config';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [ConfigModule.forFeature(mailConfig), QueueModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
