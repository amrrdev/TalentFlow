import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  estimatedWork: string;

  @IsString()
  @IsNotEmpty()
  coverLetter: string;

  @IsUrl()
  @IsNotEmpty()
  cv: string;

  @IsString()
  @IsNotEmpty()
  experience: string;
}
