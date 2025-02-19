import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ description: 'User email address.', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password (min 8 chars).', example: 'StrongP@ssw0rd' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
