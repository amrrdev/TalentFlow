import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisModule } from '../../redis/redis.module';
import { MailProcessor } from '../mail/mail.processor';
import { ConfigModule } from '@nestjs/config';
import mailConfig from '../mail/config/mail.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    RedisModule,
    BullModule.forRootAsync({
      imports: [RedisModule],
      useFactory: (redisClient: Redis) => ({
        connection: redisClient,
      }),
      inject: ['REDIS_CLIENT'],
    }),

    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
