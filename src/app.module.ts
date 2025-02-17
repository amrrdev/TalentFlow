import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { QueueModule } from './integrations/queue/queue.module';
import { MailModule } from './integrations/mail/mail.module';
import { GroqModule } from './integrations/grok/groq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    RedisModule,
    UsersModule,
    QueueModule,
    MailModule,
    GroqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
