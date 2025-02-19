import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createChat(clientId: number, freelancerId: number) {
    const chatExists = await this.databaseService.chat.findUnique({
      where: {
        clientId_freelancerId: {
          clientId,
          freelancerId,
        },
      },
    });

    if (chatExists) {
      return chatExists.id;
    }
    const newChat = await this.databaseService.chat.create({
      data: {
        clientId,
        freelancerId,
      },
    });
    return newChat.id;
  }

  async getChatId(clientId: number, proposalId: number) {
    const proposal = await this.databaseService.proposals.findUnique({
      where: {
        id: proposalId,
        status: 'accepted',
      },
    });

    if (!proposal) {
      throw new BadRequestException(
        'You must accept the proposal first before starting a chat with the freelancer.',
      );
    }

    const chat = await this.databaseService.chat.findUnique({
      where: {
        clientId_freelancerId: {
          freelancerId: proposal.freelancerId,
          clientId,
        },
      },
    });

    if (!chat) {
      throw new BadRequestException(
        'No chat found. You must accept the proposal to establish a chat.',
      );
    }
    return { chatId: chat.id };
  }

  async saveMessages(clientId: number, chatId: number, message: string) {
    await this.databaseService.messages.create({
      data: {
        content: message,
        chatId: chatId,
        senderId: clientId,
      },
    });
    console.log('message saved');
  }
}
