import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProposalDto } from './create-proposal.dto';

export class UpdateProposalDto extends PartialType(
  PickType(CreateProposalDto, ['proposalUrl', 'additionalDerails']),
) {
  @ApiPropertyOptional({
    description: 'Updated URL of the proposal document',
    example: 'https://example.com/updated-proposal.pdf',
  })
  proposalUrl?: string;

  @ApiPropertyOptional({
    description: 'Updated additional details about the proposal',
    example: 'Revised milestones and new deliverables.',
  })
  additionalDerails?: string;
}
