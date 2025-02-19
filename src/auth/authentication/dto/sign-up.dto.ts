import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
  Client = 'client',
  Freelancer = 'freelancer',
}

export class SignUpDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'User email address. Must be a valid email format.',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'User password. Must be at least 8 characters long.',
    example: 'StrongP@ssw0rd',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @ApiProperty({
    description:
      'User role, which determines the account type. Can be either "client" or "freelancer".',
    enum: UserRole,
    example: UserRole.Client,
  })
  @IsEnum(UserRole, { message: 'User type must be either "client" or "freelancer".' })
  userType: UserRole;
}
