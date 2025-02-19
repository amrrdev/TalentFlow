import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateBidDto {
  @ApiProperty({ description: 'Bid amount offered by the freelancer', example: 500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Estimated work duration (e.g., "2 weeks")', example: '2 weeks' })
  @IsString()
  @IsNotEmpty()
  estimatedWork: string;

  @ApiProperty({
    description: 'Cover letter explaining why the freelancer is suitable for the project',
    example: 'I have 5 years of experience in web development...',
  })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;

  @ApiProperty({
    description: 'URL of the freelancer’s CV',
    example: 'https://example.com/my-cv.pdf',
  })
  @IsUrl()
  @IsNotEmpty()
  cv: string;

  @ApiProperty({
    description: 'Brief experience details of the freelancer',
    example: '3 years of experience in full-stack development',
  })
  @IsString()
  @IsNotEmpty()
  experience: string;
}
