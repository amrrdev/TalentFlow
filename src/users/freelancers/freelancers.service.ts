import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { OpenAiService } from '../../integrations/open-ai/open-ai.service';

@Injectable()
export class FreelancersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly openaiService: OpenAiService,
  ) {}

  async createBid(freelancerId: number, projectId: number, createBidDto: CreateBidDto) {
    const project = await this.databaseService.projects.findUnique({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found. Please check the project ID.');
    }

    const alreadyHaveBid = await this.getFreelancerBid(freelancerId, projectId);

    if (alreadyHaveBid) {
      throw new BadRequestException('already have bid on this project.');
    }

    return await this.databaseService.bids.create({
      data: {
        freelancerId,
        projectId,
        ...createBidDto,
      },
    });
  }

  async updateBid(freelancerId: number, projectId: number, updateBidDto: UpdateBidDto) {
    const freelancerBid = await this.getFreelancerBid(freelancerId, projectId);

    if (!freelancerBid) {
      throw new NotFoundException('Bid not found or you are not authorized to update it.');
    }

    try {
      return await this.databaseService.bids.update({
        where: { id: freelancerBid.id },
        data: updateBidDto,
      });
    } catch (err) {
      throw new BadRequestException('Failed to update bid. Please check your input and try again');
    }
  }

  async deleteBid(freelancerId: number, projectId: number) {
    const freelancerBid = await this.getFreelancerBid(freelancerId, projectId);

    if (!freelancerBid) {
      throw new NotFoundException('Bid not found or you are not authorized to delete it.');
    }

    try {
      await this.databaseService.bids.delete({
        where: {
          freelancerId_projectId: {
            freelancerId,
            projectId,
          },
        },
      });
      return { message: 'Bid successfully deleted.' };
    } catch (err) {
      throw new BadRequestException('we can not delete the bid right now, please try later');
    }
  }

  // TODO: find a better way, may make the openAi service came by herself.
  async getSuggestions(projectId: number, createBidDto: CreateBidDto) {
    const allBidsOnProject = await this.getAllBidsOnProject(projectId);
    return await this.openaiService.suggestBid(createBidDto, allBidsOnProject);
  }

  async getAllBidsOnProject(projectId: number) {
    return await this.databaseService.bids.findMany({ where: { projectId } });
  }

  async getFreelancerBid(freelancerId: number, projectId: number) {
    return await this.databaseService.bids.findUnique({
      where: {
        freelancerId_projectId: {
          freelancerId,
          projectId,
        },
      },
    });
  }
}
