import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { MailService } from '../../../integrations/mail/mail.service';
import { EmailType } from '../../../integrations/mail/enums/email-type.enum';

@Injectable()
export class ClientProposalService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async proposalsOnClientProject(projectId: number, clientId: number) {
    const project = await this.databaseService.projects.findUnique({
      where: {
        id: projectId,
      },
      select: {
        clientId: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.clientId !== clientId) {
      throw new UnauthorizedException('You are not authorized to view proposals for this project');
    }

    try {
      const proposals = await this.databaseService.proposals.findMany({
        where: {
          projectId,
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              bid: true,
            },
          },
        },
      });
      return proposals;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to fetch proposals');
    }
  }

  async acceptFinalProposal(projectId: number, clientId: number, proposalId: number) {
    const project = await this.databaseService.projects.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        clientId: true,
        status: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.clientId !== clientId) {
      throw new UnauthorizedException('You are not authorized to view proposals for this project');
    }

    const proposal = await this.databaseService.proposals.findUnique({
      where: {
        id: proposalId,
      },
      select: {
        id: true,
        projectId: true,
        status: true,
      },
    });

    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${proposalId} not found`);
    }
    if (proposal.projectId !== projectId) {
      throw new BadRequestException('Proposal does not belong to the specified project');
    }
    if (proposal.status !== 'pending') {
      throw new BadRequestException('Proposal is not in a pending state');
    }

    await this.databaseService.$transaction(async prisma => {
      await prisma.proposals.update({
        where: {
          id: proposalId,
        },
        data: {
          status: 'accepted',
        },
      });
      await prisma.proposals.updateMany({
        where: {
          projectId,
          id: {
            not: proposalId,
          },
        },
        data: {
          status: 'rejected',
        },
      });
      await prisma.projects.update({
        where: {
          id: projectId,
        },
        data: {
          status: 'in_progress',
        },
      });
    });

    const allProposals = await this.databaseService.proposals.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    for (const proposal of allProposals) {
      if (proposal.status === 'accepted') {
        this.mailService.sendEmail(EmailType.AcceptedProposal, proposal.user.email);
      } else if (proposal.status === 'rejected') {
        this.mailService.sendEmail(EmailType.RejectedProposal, proposal.user.email);
      }
    }

    return {
      message: 'Proposal accepted successfully',
      data: {
        proposalId,
        status: 'accepted',
      },
    };
  }
}
