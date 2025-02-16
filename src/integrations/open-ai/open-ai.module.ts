import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import openAiConfig from './config/open-ai.config';
import { OpenAiService } from './open-ai.service';

@Module({
  imports: [ConfigModule.forFeature(openAiConfig)],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
