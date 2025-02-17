import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProposalDto } from './create-proposal.dto';

export class UpdateProposalDto extends PartialType(
  PickType(CreateProposalDto, ['proposalUrl', 'additionalDerails']),
) {}
