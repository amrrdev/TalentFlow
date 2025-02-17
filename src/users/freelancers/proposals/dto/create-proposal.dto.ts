import { IsOptional, IsUrl } from 'class-validator';

export class CreateProposalDto {
  @IsUrl()
  proposalUrl: string;

  @IsOptional()
  additionalDerails?: string;
}
