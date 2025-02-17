import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  gmailUsername: process.env.GMAIL_USERNAME,
  gmailPassword: process.env.GMAIL_PASSWORD,
}));
