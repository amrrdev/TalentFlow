import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import jwtConfig from '../../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from '../../integrations/queue/queue.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    QueueModule,
  ],
  providers: [ChatGateway],
})
export class GateWayModule {}
