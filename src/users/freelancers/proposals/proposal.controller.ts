import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ActiveUser } from '../../../auth/decorators/active-user.decorator';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../../auth/authorization/decorators/role.decorator';
import { Auth } from '../../../auth/authentication/decorators/auth.decorator';
import { AuthType } from '../../../auth/authentication/enums/auth-type.enum';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Auth(AuthType.Bearer)
@Roles(Role.Freelancer)
@Controller('freelancers')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('proposal/:projectId')
  createProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    return this.proposalService.createProposal(freelancerId, projectId, createProposalDto);
  }

  @Patch('proposal/:projectId')
  updateProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    return this.proposalService.updateProposal(freelancerId, projectId, updateProposalDto);
  }

  @Delete('proposal/:projectId')
  deleteProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.proposalService.deleteProposal(freelancerId, projectId);
  }

  @Get('proposal/:projectId')
  getProposal(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.proposalService.getProposal(freelancerId, projectId);
  }
}
