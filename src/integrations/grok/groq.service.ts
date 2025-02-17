import { Inject, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import groqConfig from './config/groq.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GroqService {
  private groq: Groq;
  constructor(
    @Inject(groqConfig.KEY) private readonly groqConfigrations: ConfigType<typeof groqConfig>,
  ) {
    this.groq = new Groq({
      apiKey: this.groqConfigrations.groqApiKey,
    });
  }

  async getGroqChatCompletion(systemPrompt: string, userPrompt: string) {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama3-70b-8192',
    });
    return chatCompletion.choices[0].message?.content || '';
  }
}
