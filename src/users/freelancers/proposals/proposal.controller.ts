import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ActiveUser } from '../../../auth/decorators/active-user.decorator';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../../auth/authorization/decorators/role.decorator';
import { Auth } from '../../../auth/authentication/decorators/auth.decorator';
import { AuthType } from '../../../auth/authentication/enums/auth-type.enum';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Proposals')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@Roles(Role.Freelancer)
@Controller('freelancers')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('proposal/:projectId')
  @ApiOperation({ summary: 'Submit a proposal for a project' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  createProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    return this.proposalService.createProposal(freelancerId, projectId, createProposalDto);
  }

  @Patch('proposal/:projectId')
  @ApiOperation({ summary: 'Update an existing proposal' })
  @ApiResponse({ status: 200, description: 'Proposal updated successfully' })
  updateProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    return this.proposalService.updateProposal(freelancerId, projectId, updateProposalDto);
  }

  @Delete('proposal/:projectId')
  @ApiOperation({ summary: 'Delete a proposal' })
  @ApiResponse({ status: 200, description: 'Proposal deleted successfully' })
  deleteProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.proposalService.deleteProposal(freelancerId, projectId);
  }

  @Get('proposal/:projectId')
  @ApiOperation({ summary: "Retrieve a freelancer's proposal for a project" })
  @ApiResponse({ status: 200, description: 'Proposal retrieved successfully' })
  getProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.proposalService.getProposal(freelancerId, projectId);
  }
}
