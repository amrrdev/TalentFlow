import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DatabaseService } from '../../../database/database.service';

@Processor('contract-queue')
export class ContractProcessor extends WorkerHost {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }
  async process(job: Job, token?: string): Promise<any> {
    try {
      console.log('Processing contract creation job:', job.data);
      const { projectId, clientId, freelancerId } = job.data;

      if (!projectId || !clientId || !freelancerId) {
        throw new Error('Missing required data: projectId, clientId, or freelancerId');
      }

      const project = await this.databaseService.projects.findUnique({
        where: {
          id: projectId,
        },
        include: {
          user: true,
        },
      });

      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const bid = await this.databaseService.bids.findUnique({
        where: {
          freelancerId_projectId: {
            freelancerId,
            projectId,
          },
        },
      });

      if (!bid) {
        throw new Error(
          `Bid for freelancer with id ${freelancerId} and project with id ${projectId} not found`,
        );
      }

      const contract = await this.databaseService.contracts.create({
        data: {
          projectId,
          freelancerId,
          clientId,
          projectBudget: bid.amount,
          projectDescription: project.description,
          projectDuration: bid.estimatedWork,
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      return contract;
    } catch (error) {
      console.error('Error processing contract creation:', error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Contract creation job #${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Contract creation job #${job.id} failed:`, error);
  }
}
