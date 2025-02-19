import { forwardRef, Global, Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './chat.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
