import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createProposal(
    freelancerId: number,
    projectId: number,
    createProposalDto: CreateProposalDto,
  ) {
    const bidOnProject = await this.getBidOnProject(freelancerId, projectId);

    if (!bidOnProject) {
      throw new NotFoundException(
        'You can only create a proposal if your bid on this project has been accepted',
      );
    }

    const haveProposalOnProject = await this.getFreelancerProposal(
      freelancerId,
      projectId,
      bidOnProject.id,
    );

    if (haveProposalOnProject) {
      throw new ConflictException('You have already submitted a proposal for this project.');
    }

    try {
      return await this.databaseService.proposals.create({
        data: {
          ...createProposalDto,
          freelancerId,
          projectId,
          bidId: bidOnProject.id,
        },
      });
    } catch (err) {
      throw new BadRequestException(
        'Failed to create the proposal. Please check your data and try again.',
      );
    }
  }

  private async getBidOnProject(freelancerId: number, projectId: number) {
    return await this.databaseService.bids.findUnique({
      where: {
        freelancerId_projectId: {
          freelancerId,
          projectId,
        },
        status: 'accepted',
      },
    });
  }

  async getProposal(freelancerId: number, projectId: number) {
    const bidOnProject = await this.getBidOnProject(freelancerId, projectId);

    if (!bidOnProject) {
      throw new NotFoundException(
        'You cannot view the proposal because you have not placed an accepted bid on this project.',
      );
    }

    const proposal = await this.getFreelancerProposal(freelancerId, projectId, bidOnProject.id);

    if (!proposal) {
      throw new NotFoundException('No proposal found for this project.');
    }

    return proposal;
  }

  async updateProposal(
    freelancerId: number,
    projectId: number,
    updateProposalDto: UpdateProposalDto,
  ) {
    const bidOnProject = await this.getBidOnProject(freelancerId, projectId);

    if (!bidOnProject) {
      throw new NotFoundException(
        'You cannot update the proposal because you have not placed an accepted bid on this project.',
      );
    }

    const haveProposalOnProject = await this.getFreelancerProposal(
      freelancerId,
      projectId,
      bidOnProject.id,
    );

    if (!haveProposalOnProject) {
      throw new NotFoundException(
        'No proposal found for this project. You can only update an existing proposal.',
      );
    }

    try {
      return await this.databaseService.proposals.update({
        where: {
          id: haveProposalOnProject.id,
        },
        data: updateProposalDto,
      });
    } catch (err) {
      throw new BadRequestException('Failed to update the proposal.');
    }
  }

  async deleteProposal(freelancerId: number, projectId: number) {
    const bidOnProject = await this.getBidOnProject(freelancerId, projectId);

    if (!bidOnProject) {
      throw new NotFoundException(
        'You cannot delete the proposal because you have not placed an accepted bid on this project.',
      );
    }

    const haveProposalOnProject = await this.getFreelancerProposal(
      freelancerId,
      projectId,
      bidOnProject.id,
    );

    if (!haveProposalOnProject) {
      throw new NotFoundException('No proposal found for this project.');
    }

    try {
      await this.databaseService.proposals.delete({
        where: {
          id: haveProposalOnProject.id,
        },
      });

      return { message: 'Proposal deleted successfully.' };
    } catch (err) {
      throw new BadRequestException('Failed to delete the proposal.');
    }
  }

  private async getFreelancerProposal(freelancerId: number, projectId: number, bidId: number) {
    return await this.databaseService.proposals.findUnique({
      where: {
        freelancerId,
        projectId,
        bidId,
      },
    });
  }
}
