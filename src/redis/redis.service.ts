import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import * as Redis from 'ioredis';
@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKet(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKet(userId));
    return storedId === tokenId;
  }

  async invalidate(userId: number) {
    await this.redisClient.del(this.getKet(userId));
  }

  private getKet(userId: number): string {
    return `user-${userId}`;
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
