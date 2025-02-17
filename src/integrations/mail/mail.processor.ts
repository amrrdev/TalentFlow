import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import * as nodeMailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import mailConfig from './config/mail.config';
import { ConfigType } from '@nestjs/config';

@Processor('mail-queue', { concurrency: 10 })
export class MailProcessor extends WorkerHost {
  private transporter: nodeMailer.Transporter;
  private mailOptions: MailOptions;
  constructor(
    @Inject(mailConfig.KEY) private readonly mailConfigrations: ConfigType<typeof mailConfig>,
  ) {
    super();
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: mailConfigrations.gmailUsername,
        pass: mailConfigrations.gmailPassword,
      },
    });
  }
  async process(job: Job, token?: string): Promise<any> {
    const { to, from, text, subject } = job.data;
    this.mailOptions = {
      to,
      from,
      text,
      subject,
    };
    await this.transporter.sendMail(this.mailOptions);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Job with ID #${job.id} FAILED!`);
  }
}
