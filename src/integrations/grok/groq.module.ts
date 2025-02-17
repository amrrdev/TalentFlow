import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { ConfigModule } from '@nestjs/config';
import groqConfig from './config/groq.config';

@Module({
  imports: [ConfigModule.forFeature(groqConfig)],
  providers: [GroqService],
  exports: [GroqService],
})
export class GroqModule {}
