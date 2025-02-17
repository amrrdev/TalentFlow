import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SelectBidDto } from './dto/select-bid.dto';
import { MailService } from '../../integrations/mail/mail.service';
import { EmailType } from '../../integrations/mail/enums/email-type.enum';
import { GroqService } from '../../integrations/grok/groq.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly gorqService: GroqService,
  ) {}

  async getAllProjects(clientId: number) {
    return await this.databaseService.projects.findMany({
      where: {
        clientId,
        deletedAt: null,
      },
      include: { bid: true },
    });
  }

  async getAllBidsOnProject(projectId: number) {
    try {
      return await this.databaseService.bids.findMany({
        where: { projectId },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'we can not process your request right now, please try later',
      );
    }
  }

  async createProject(clientId: number, createProjectDto: CreateProjectDto) {
    // TODO: Ensure that a client can create only one project per week.
    // TODO: Intercept the response and the unneccessery data (deletedAt)
    return await this.databaseService.projects.create({
      data: {
        ...createProjectDto,
        clientId,
      },
    });
  }

  async updateProject(clientId: number, projectId: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.databaseService.projects.findUnique({
      where: {
        id: projectId,
        clientId,
      },
    });

    if (!project) {
      throw new UnauthorizedException(
        'Project not found or you are not authorized to update it. Please check the project ID or ensure you are the project owner.',
      );
    }
    try {
      const updateProject = await this.databaseService.projects.update({
        where: {
          id: projectId,
          clientId,
        },
        data: updateProjectDto,
      });

      return updateProject;
    } catch (err) {
      throw new BadRequestException('we can not update the project right now, please try later.');
    }
  }

  async deleteProject(clientId: number, projectId: number) {
    const project = await this.databaseService.projects.findUnique({
      where: {
        id: projectId,
        clientId,
      },
      select: { status: true },
    });

    if (!project) {
      throw new UnauthorizedException(
        'Project not found or you are not authorized to delete it. Please check the project ID or ensure you are the project owner.',
      );
    }

    if (project.status === 'in_progress' || project.status === 'completed') {
      throw new BadRequestException(
        `You cannot delete this project because it is already in ${project.status} state.`,
      );
    }

    try {
      // soft delete by setting deletedAt
      await this.databaseService.projects.update({
        where: {
          id: projectId,
          clientId,
        },
        data: { deletedAt: new Date(), status: 'closed' },
      });
      return { message: 'Project successfully closed.' };
    } catch (err) {
      throw new BadRequestException('we can not update the project right now, please try later.');
    }
  }
  // TODO: Implement AI-powered bid recommendations for the client

  async selectBid(clientId: number, projectId: number, selectBidDto: SelectBidDto) {
    const project = await this.databaseService.projects.findUnique({
      where: {
        id: projectId,
        clientId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or does not belong to the client.');
    }

    const bids = await this.databaseService.bids.findMany({
      where: {
        id: { in: selectBidDto.ids },
        projectId,
      },
      include: { freelancer: true },
    });

    if (bids.length < selectBidDto.ids.length) {
      throw new BadRequestException('Invalid selection: Some bids do not exist');
    }
    try {
      await this.databaseService.bids.updateMany({
        where: {
          id: { in: selectBidDto.ids },
          projectId,
        },
        data: {
          status: 'accepted',
        },
      });

      await this.databaseService.bids.updateMany({
        where: {
          id: {
            notIn: selectBidDto.ids,
          },
          projectId,
        },
        data: {
          status: 'rejected',
        },
      });

      const registedBids = await this.databaseService.bids.findMany({
        where: {
          id: {
            notIn: selectBidDto.ids,
          },
          projectId,
        },
        include: {
          freelancer: true,
        },
      });

      for (const bid of bids) {
        this.mailService.sendEmail(EmailType.AcceptedBid, bid.freelancer.email);
      }

      for (const rBid of registedBids) {
        this.mailService.sendEmail(EmailType.RejectedBid, rBid.freelancer.email);
      }

      return { message: 'Bids accepted successfully.' };
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred while updating the bids. Please try again later.',
      );
    }
  }

  async bidRecommendationsOnMyProject(projectId: number) {
    const allBidsOnProject = await this.databaseService.bids.findMany({
      where: { projectId },
      include: { project: true },
    });

    if (allBidsOnProject.length === 0) {
      return { message: 'Your bid is within the normal range' };
    }
    const systemPrompt =
      'You are a highly experienced freelance bidding advisor. Your role is to assist clients by evaluating multiple bids for a project, considering key factors like cost, experience, quality, and timeline. Provide clear, actionable recommendations based on these evaluations';
    const userPrompt = `After reviewing the following bids for the project: ${JSON.stringify(allBidsOnProject, null, 2)}, please provide your expert recommendations on the top 2-3 bids that offer the best value for the client. Consider factors such as cost-effectiveness, quality of the work, and the proposed timeline for completion. Based on these aspects, suggest the most suitable options for the client to choose, ensuring they receive the most optimal combination of value and efficiency.`;

    try {
      return await this.gorqService.getGroqChatCompletion(systemPrompt, userPrompt);
    } catch (err) {
      throw new BadRequestException('ال ai مريح شوية ');
    }
  }
}
