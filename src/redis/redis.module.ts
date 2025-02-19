import { Module } from '@nestjs/common';
import redisConfig from './config/redis.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (redisConfigrations: ConfigType<typeof redisConfig>) => {
        return new Redis({
          password: redisConfigrations.password,
          port: parseInt(redisConfigrations.port ?? '6379', 10),
          host: redisConfigrations.host,
          maxRetriesPerRequest: null,
        });
      },
      inject: [redisConfig.KEY],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
