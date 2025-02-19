import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ClientProposalService } from './client-proposal.service';
import { ActiveUser } from '../../../auth/decorators/active-user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Project Proposal')
@Controller('projects')
@ApiBearerAuth()
export class ClientProposalController {
  constructor(private readonly clientProposalService: ClientProposalService) {}

  @Get(':projectId/proposals')
  @ApiOperation({ summary: 'Get all proposals for a project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project', example: 1 })
  proposalsOnClientProject(
    @ActiveUser('sub') clientId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.clientProposalService.proposalsOnClientProject(projectId, clientId);
  }

  @Patch(':projectId/proposals/:proposalId/accept')
  @ApiOperation({ summary: 'Accept a final proposal for a project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project', example: 1 })
  @ApiParam({ name: 'proposalId', description: 'The ID of the proposal', example: 10 })
  acceptFinalProposal(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('proposalId', ParseIntPipe) proposalId: number,
    @ActiveUser('sub') clientId: number,
  ) {
    return this.clientProposalService.acceptFinalProposal(projectId, clientId, proposalId);
  }

  @Get(':projectId/proposals/:proposalId/chat')
  @ApiOperation({ summary: 'Get chat ID for a proposal' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project', example: 1 })
  @ApiParam({ name: 'proposalId', description: 'The ID of the proposal', example: 10 })
  getChatId(
    @ActiveUser('sub') clientId: number,
    @Param('proposalId', ParseIntPipe) proposalId: number,
  ) {
    return this.clientProposalService.getChatId(clientId, proposalId);
  }
}
