import { registerAs } from '@nestjs/config';

export default registerAs('groq', () => ({
  groqApiKey: process.env.GROQ_API_KEY,
}));
