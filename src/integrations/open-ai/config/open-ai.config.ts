import { registerAs } from '@nestjs/config';

export default registerAs('open-ai', () => ({
  openAiKey: process.env.OPEN_AI_API_KEY,
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  lamaiApiKey: process.env.AIMAL_API_KEY,
}));
