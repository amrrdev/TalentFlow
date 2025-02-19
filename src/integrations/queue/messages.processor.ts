import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DatabaseService } from '../../database/database.service';

@Processor('messages-queue')
export class MessagesProcessor extends WorkerHost {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }
  async process(job: Job, token?: string): Promise<any> {
    const { message, clientId, chatId } = job.data;
    const newMessage = await this.databaseService.messages.create({
      data: {
        content: message,
        chatId: Number(chatId),
        senderId: clientId,
      },
    });
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
