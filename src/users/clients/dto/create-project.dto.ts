import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, IsISO8601, IsDate } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'The title of the project', example: 'Web Development Project' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the project',
    example: 'Build a full-stack web application',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The budget for the project in USD', example: 500 })
  @IsNumber()
  budget: number;

  @ApiProperty({ description: 'The category of the project', example: 'Web Development' })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'A list of required skills for the project',
    example: ['JavaScript', 'NestJS', 'PostgreSQL'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({
    description: 'The deadline for project completion (ISO8601 format)',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  deadline?: Date;
}
