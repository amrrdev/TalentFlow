import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  amount: number;

  @IsString()
  estimatedWork: string;

  @IsString()
  coverLetter: string;

  @IsUrl()
  cv: string;
}
