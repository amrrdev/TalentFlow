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

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
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
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserDate>>(user.id, this.jwtConfigrations.accessTokenTtl, {
        email: user.email,
      }),
      this.signToken(user.id, this.jwtConfigrations.refreshTokenTtl),
    ]);

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
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserDate, 'sub'>>(
        refreshTokenDto.refreshToken,
        {
          issuer: this.jwtConfigrations.issuer,
          secret: this.jwtConfigrations.secret,
          audience: this.jwtConfigrations.audience,
        },
      );

      const user = await this.databaseService.users.findUnique({
        where: { id: sub },
      });

      if (!user) {
        throw new BadRequestException('we can not find a user with this refresh token');
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
