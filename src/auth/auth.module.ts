import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RedisModule } from '../redis/redis.module';
import { RoleGuard } from './authorization/guards/role.guard';

@Module({
  imports: [
    RedisModule,
    DatabaseModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),

    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AuthenticationService,
    AccessTokenGuard,
    Reflector,
  ],
})
export class AuthModule {}
