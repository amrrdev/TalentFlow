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

@Injectable()
export class ClientsService {
  constructor(private readonly databaseService: DatabaseService) {}

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
      return { message: 'Bids accepted successfully.' };

      // TODO: Notify accepted users via email using Nodemailer and BullMQ for queue processing
    } catch (err) {
      throw new InternalServerErrorException(
        'An error occurred while updating the bids. Please try again later.',
      );
    }
  }
}
