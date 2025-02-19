import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisModule } from '../../redis/redis.module';
import { MailProcessor } from '../mail/mail.processor';
import { ConfigModule } from '@nestjs/config';
import mailConfig from '../mail/config/mail.config';
import { ContractProcessor } from '../../users/clients/proposal/contract.processor';
import { DatabaseModule } from '../../database/database.module';
import { ChatProcessor } from './chat.processor';
import { ChatModule } from '../../chat/chat.module';
import { MessagesProcessor } from './messages.processor';

@Module({
  imports: [
    ChatModule,
    DatabaseModule,
    ConfigModule.forFeature(mailConfig),
    RedisModule,

    BullModule.forRootAsync({
      imports: [RedisModule],
      useFactory: (redisClient: Redis) => ({
        connection: redisClient,
      }),
      inject: ['REDIS_CLIENT'],
    }),

    BullModule.registerQueue(
      {
        name: 'mail-queue',
      },
      {
        name: 'contract-queue',
      },
      {
        name: 'chat-queue',
      },
      {
        name: 'messages-queue',
      },
    ),
  ],
  providers: [MailProcessor, ContractProcessor, ChatProcessor, MessagesProcessor],
  exports: [BullModule, MessagesProcessor],
})
export class QueueModule {}
