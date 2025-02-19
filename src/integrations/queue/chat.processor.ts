import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChatService } from '../../chat/chat.service';

@Processor('chat-queue')
export class ChatProcessor extends WorkerHost {
  constructor(private readonly chatService: ChatService) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { clientId, freelancerId } = job.data;

    console.log(`Triggering chat-queue: clientId=${clientId}, freelancerId=${freelancerId}`);

    const chatId = await this.chatService.createChat(clientId, freelancerId);
    return chatId;
  }

  @OnWorkerEvent('failed')
  handleFailedJobs(job: Job) {
    console.log(`failed job with this data ${job.data}`);
  }
}
