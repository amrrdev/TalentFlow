import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

enum UserRole {
  Client = 'client',
  Freelancer = 'freelancer',
}

export class SignUpDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty()
  firstName: string;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty()
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address.' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsEnum(UserRole)
  userType: 'client' | 'freelancer';
}
