import { Inject, Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import mailConfig from './config/mail.config';
import { ConfigType } from '@nestjs/config';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { EmailType } from './enums/email-type.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  private transporter: nodeMailer.Transporter;
  private mailOptions: MailOptions;

  constructor(
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
    @Inject(mailConfig.KEY) private readonly mailConfigrations: ConfigType<typeof mailConfig>,
  ) {}
  async sendEmail(emailType: EmailType, to: string) {
    let subject: string;
    let text: string;

    switch (emailType) {
      case EmailType.AcceptedBid:
        subject = '🎉 Congratulations! Your Bid Has Been Accepted';
        text = `Dear User,

We are pleased to inform you that your bid has been **successfully accepted**! 🎉

Next Steps:
- Please review the details in your dashboard.
- Create a proposal for the project.

If you have any questions, feel free to reach out to our support team.

Best regards,  
[freelancing marketplace]`;
        break;

      case EmailType.RejectedBid:
        subject = '⚠️ Your Bid Was Not Accepted This Time';
        text = `Dear User,

We appreciate your interest and effort in placing a bid. Unfortunately, your bid was **not accepted** this time. 😔 

Don't be discouraged! Here’s what you can do:
- Explore other available projects.
- Improve your bid and try again.
- Stay updated with new opportunities.

Thank you for being a valued user. Keep bidding and good luck!

Best regards,  
[freelancing marketplace]`;
        break;

      case EmailType.AcceptedProposal:
        subject = '🎉 Congratulations! Your Proposal Has Been Accepted';
        text = `Dear User,

We are thrilled to inform you that your proposal has been **accepted**! 🎉

Next Steps:
- Review the project details in your dashboard.
- Coordinate with the client to start the project.
- Ensure timely delivery and communication.

If you have any questions, feel free to reach out to our support team.

Best regards,  
[freelancing marketplace]`;
        break;

      case EmailType.RejectedProposal:
        subject = '⚠️ Your Proposal Was Not Accepted This Time';
        text = `Dear User,

We appreciate your effort in submitting a proposal. Unfortunately, your proposal was **not accepted** this time. 😔 

Don't be discouraged! Here’s what you can do:
- Explore other available projects.
- Improve your proposal and try again.
- Stay updated with new opportunities.

Thank you for being a valued user. Keep proposing and good luck!

Best regards,  
[freelancing marketplace]`;
        break;

      default: {
        throw new Error('Invalid email type');
      }
    }

    await this.mailQueue.add('send-email', {
      to,
      from: this.mailConfigrations.gmailUsername,
      text,
      subject,
    });
  }
}
