import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { Prisma } from '@prisma/client';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.databaseService.users.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (!user || !(await this.hashingService.compare(signInDto.password, user.password))) {
      throw new BadRequestException('Invalid email or password, try again');
    }

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfigrations.secret,
        audience: this.jwtConfigrations.audience,
        issuer: this.jwtConfigrations.issuer,
        expiresIn: this.jwtConfigrations.accessTokenTtl,
      },
    );
    return {
      accessToken,
    };
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

    // TODO: Generate access token and refresh token
    return newUser;
  }
}
