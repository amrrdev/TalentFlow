import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsString } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({
    description: 'URL of the proposal document',
    example: 'https://example.com/proposal.pdf',
  })
  @IsUrl()
  proposalUrl: string;

  @ApiPropertyOptional({
    description: 'Additional details about the proposal',
    example: 'This proposal includes revised project timelines and milestones.',
  })
  @IsOptional()
  @IsString()
  additionalDerails?: string;
}
