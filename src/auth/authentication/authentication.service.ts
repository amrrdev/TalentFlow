import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { Prisma, Users } from '@prisma/client';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserDate } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../../redis/redis.service';
import { Role } from '../../users/enum/role.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.databaseService.users.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (!user || !(await this.hashingService.compare(signInDto.password, user.password))) {
      throw new BadRequestException('Invalid email or password, try again');
    }

    return await this.generateTokens(user);
  }

  public async generateTokens(user: Users) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserDate>>(user.id, this.jwtConfigrations.accessTokenTtl, {
        email: user.email,
        role: user.userType === 'client' ? Role.Client : Role.Freelancer,
      }),

      this.signToken(user.id, this.jwtConfigrations.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.redisService.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.sign(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfigrations.secret,
        audience: this.jwtConfigrations.audience,
        issuer: this.jwtConfigrations.issuer,
        expiresIn,
      },
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<Prisma.UsersCreateInput> {
    const userExists = await this.databaseService.users.findUnique({
      where: { email: signUpDto.email },
    });

    if (userExists) {
      throw new BadRequestException(
        'An account with this email already exists. Please use a different email or log in.',
      );
    }

    Object.assign(signUpDto, {
      ...signUpDto,
      password: await this.hashingService.hash(signUpDto.password),
    });

    const newUser = await this.databaseService.users.create({
      data: signUpDto,
    });

    return newUser;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserDate, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        issuer: this.jwtConfigrations.issuer,
        secret: this.jwtConfigrations.secret,
        audience: this.jwtConfigrations.audience,
      });

      const user = await this.databaseService.users.findUnique({
        where: { id: sub },
      });

      if (!user) {
        throw new BadRequestException('we can not find a user with this refresh token');
      }

      const isValid = await this.redisService.validate(user.id, refreshTokenId);
      if (isValid) {
        await this.redisService.invalidate(user.id);
      } else {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
