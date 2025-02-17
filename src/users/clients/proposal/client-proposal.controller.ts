import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ClientProposalService } from './client-proposal.service';
import { ActiveUser } from '../../../auth/decorators/active-user.decorator';

@Controller('projects')
export class ClientProposalController {
  constructor(private readonly clientProposalService: ClientProposalService) {}

  @Get(':projectId/proposals')
  proposalsOnClientProject(
    @ActiveUser('sub') clientId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.clientProposalService.proposalsOnClientProject(projectId, clientId);
  }

  @Patch(':projectId/proposals/:proposalId/accept')
  acceptFinalProposal(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('proposalId', ParseIntPipe) proposalId: number,
    @ActiveUser('sub') clientId: number,
  ) {
    return this.clientProposalService.acceptFinalProposal(projectId, clientId, proposalId);
  }
}
