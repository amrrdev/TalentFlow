import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { GroqService } from '../../integrations/grok/groq.service';
import { CreateProposalDto } from './proposals/dto/create-proposal.dto';

@Injectable()
export class FreelancersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly groqService: GroqService,
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

  async getSuggestionsOnMyBid(projectId: number, createBidDto: CreateBidDto) {
    const allBidsOnProject = await this.getAllBidsOnProject(projectId);

    if (allBidsOnProject.length === 0) {
      return { message: 'Your bid is within the normal range' };
    }

    const amoutBids = allBidsOnProject.map(bid => Number(bid.amount));
    const { amount, estimatedWork } = createBidDto;

    const systemPrompt =
      'You are a freelance bidding assistant agent. Your role is to evaluate new bids in the context of past bid data, considering factors like cost, estimated work, and timeline. Your advice should help the client assess whether the new bid is reasonable or requires adjustments.';
    const userPrompt = `Based on the following previous bids: ${amoutBids.join(', ')}, 
    and the new bid details: amount: ${amount}, estimated work duration: ${estimatedWork} days, and the corresponding cost for the work, 
    evaluate whether this new bid is fair in comparison. Provide an assessment of whether it is reasonably priced or if adjustments are needed, and explain your reasoning `;

    try {
      return await this.groqService.getGroqChatCompletion(systemPrompt, userPrompt);
    } catch (err) {
      throw new BadRequestException('ال ai مريح شوية ');
    }
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
